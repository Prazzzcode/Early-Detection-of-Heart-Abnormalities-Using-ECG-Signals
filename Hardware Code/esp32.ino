#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "TANISH";
const char* pass = "hello123456789";

String backendURL = "https://dd41n34w-3000.inc1.devtunnels.ms/api/sensor";

#define ECG_PIN 34 // AD8232 OUTPUT connected here

int samples[200];
int indexS = 0;

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, pass);
  Serial.println("Connecting to WiFi...");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected! IP: " + WiFi.localIP().toString());

  analogReadResolution(12); // 0–4095 range
}

void loop() {
  int raw = analogRead(ECG_PIN);
  samples[indexS] = raw;
  indexS++;

  // **Send value to Serial Plotter**
  Serial.println(raw);

  // When 200 samples stored → send batch
  if (indexS >= 200) {
    sendBatch();
    indexS = 0;
  }

  // 200 samples per second → 5ms delay
  delay(5);
}

void sendBatch() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi lost. Reconnecting...");
    WiFi.begin(ssid, pass);
    return;
  }

  HTTPClient http;
  http.begin(backendURL);
  http.addHeader("Content-Type", "application/json");

  // Build JSON body
  String json = "{\"data\":[";
  for (int i = 0; i < 200; i++) {
    json += String(samples[i]);
    if (i < 199) json += ",";
  }
  json += "]}";

  Serial.println("Sending 200-sample batch...");
  Serial.println(json);

  int code = http.POST(json);

  Serial.print("Response code: ");
  Serial.println(code);

  http.end();
}

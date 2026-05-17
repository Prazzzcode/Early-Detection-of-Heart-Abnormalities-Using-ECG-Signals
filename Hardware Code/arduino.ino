#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define PULSE_PIN 2

LiquidCrystal_I2C lcd(0x27, 16, 2); 
unsigned long lastBeatTime = 0;
int BPM = 0;
bool pulseState = false;

// Moving average for BPM stability
#define MAX_BPM_SAMPLES 5
int bpmSamples[MAX_BPM_SAMPLES];
int sampleIndex = 0;

// Finger detection threshold
#define FINGER_DETECT_DELAY 2000
 unsigned long lastPulseTime = 0;

void setup() {
  pinMode(PULSE_PIN, INPUT);
  lcd.init();
  lcd.backlight();
  Serial.begin(9600);

  for(int i=0; i<MAX_BPM_SAMPLES; i++) bpmSamples[i] = 0;

  lcd.setCursor(0,0);
  lcd.print("Place Finger...");
}

void loop() {
  unsigned long currentTime = millis();
  bool sensorValue = digitalRead(PULSE_PIN);

  // Detect rising edge of pulse
  if(sensorValue && !pulseState) {
    pulseState = true;
    lastPulseTime = currentTime;

    if(lastBeatTime > 0) {
      int instantBPM = 60000 / (currentTime - lastBeatTime);

      // Filter out unrealistic values
      if(instantBPM >= 40 && instantBPM <= 160) {
        bpmSamples[sampleIndex] = instantBPM;
        sampleIndex = (sampleIndex + 1) % MAX_BPM_SAMPLES;

        // Calculate average BPM
        int sum = 0, count = 0;
        for(int i=0;i<MAX_BPM_SAMPLES;i++){
          if(bpmSamples[i] > 0){ sum += bpmSamples[i]; count++; }
        }
        BPM = sum / count;

        // Update LCD
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("BPM: ");
        lcd.print(BPM);

        lcd.setCursor(0,1);
        if(BPM < 60) lcd.print("Too Low! Check");
        else if(BPM > 100) lcd.print("Too High! Care");
        else lcd.print("Heart Normal");

        Serial.println(BPM);
      }
    }

    lastBeatTime = currentTime;
  }

  // Reset pulseState when signal goes low
  if(!sensorValue) pulseState = false;

  // Detect if finger removed
  if(currentTime - lastPulseTime > FINGER_DETECT_DELAY){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Place Finger...");
    BPM = 0;
  }
}
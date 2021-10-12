# -*- coding: UTF-8 -*-
import time

from pinpong.board import Board,Pin,Servo
from pinpong.libs.dfrobot_urm09 import URM09 #从libs中导入URM09库


Board("leonardo").begin()               #初始化，选择板型(uno、leonardo、xugu)和端口号，不输入端口号则进行自动识别

urm = URM09(i2c_addr=0x11) #初始化传感器，设置I2C地址
urm.set_mode_range(urm._MEASURE_MODE_AUTOMATIC ,urm._MEASURE_RANG_500) #设置URM09模式为自动检测，最大测量距离500cm
pwm0 = Pin(Pin.D8, Pin.OUT)
pwm1 = Pin(Pin.D9,Pin.OUT)

acidpump = Servo(Pin(Pin.D11)) #将Pin传入Servo中初始化舵机引脚
alkalipump = Servo(Pin(Pin.D12)) #将Pin传入Servo中初始化舵机引脚
testpump = Servo(Pin(Pin.D13)) #将Pin传入Servo中初始化舵机引脚

def PumpTest():
  
  alkalipump.write_angle(0)
  time.sleep(2)
  alkalipump.write_angle(90)
  time.sleep(2)
  alkalipump.write_angle(180)
  time.sleep(2)
  alkalipump.write_angle(90)
  time.sleep(2)
  print("alkali pump tested")

  testpump.write_angle(0)
  time.sleep(2)
  testpump.write_angle(90)
  time.sleep(2)
  testpump.write_angle(180)
  time.sleep(2)
  testpump.write_angle(90)
  time.sleep(2)
  print("test pump tested")

  acidpump.write_angle(0)
  time.sleep(2)
  acidpump.write_angle(90)
  time.sleep(2)
  acidpump.write_angle(180)
  time.sleep(2)
  acidpump.write_angle(90)
  time.sleep(2)
  print("acid pump tested")
  return

def MoveTo():
  
  D = input("input:")
  d = int(D)
  dist = urm.distance_cm()
  if d >19 or d <= 2:
    d= dist
    
  while d - dist != 0:
    dist = urm.distance_cm()
    if d - dist > 0:
      pwm0.write_digital(1)
      pwm1.write_digital(0)
      #time.sleep(0.1)
      print("down",dist)
    if d - dist < 0:
      pwm0.write_digital(0)
      pwm1.write_digital(1)
      #time.sleep(0.1)
      print("up",dist)
    if d - dist == 0:
      pwm0.write_digital(0)
      pwm1.write_digital(0)
      time.sleep(0.5)
      print("stop",dist)
  return

while True:
  dist = urm.distance_cm() #读取距离数据，单位厘米（cm）
  temp = urm.temp_c() #读取传感器温度，单位摄氏度（℃）

  print("Distance is %d cm         "%dist)
  print("Temperature is %.2f .c    "%temp)
  time.sleep(0.5)
  PumpTest()
  MoveTo()

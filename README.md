Benchmark javascript sax parsers
==================================================
A set of tests for checking the performance of js xml parsers

Less is better


**sh: node bench-01.js**
```
count - 100000
size - 25
-------------------------------------------
ltx                            - total: 393.89  time: 176.27  1 1
saxophone                      - total: 721.08  time: 412.51  1 2
saxen   ns=off uq=on  attr=on  - total: 338.25  time: 202.83  1 1
saxjs                          - total: 600.80  time: 376.68  1 1
libxml                         - total: 1417.94 time: 1230.09 0 0
saxwasm-zero                   - total: 39741.6 time: 1164.71 0 0
saxwasm-full                   - total: 63542.3 time: 2685.29 1 1
saxwasm-abc                    - total: 46971.8 time: 2095.03 1 1
expat                          - total: 993.34  time: 658.62  1 1
expat buffer                   - total: 1229.15 time: 659.08  1 1
easysax ns=on  uq=on  attr=on  - total: 432.77  time: 215.44  1 1
easysax ns=off uq=on  attr=on  - total: 387.95  time: 184.51  1 1
easysax ns=off uq=off attr=on  - total: 372.67  time: 177.44  1 1
easysax ns=off uq=off attr=off - total: 361.75  time: 180.77  1 1
-------------------------------------------
```


**sh: node bench-02.js**
```
count - 1000
size - 22750
-------------------------------------------
ltx                            - total: 153.25  time: 147.09  251 475
saxophone                      - total: 278.76  time: 268.66  251 475
saxen   ns=off uq=on  attr=on  - total: 174.41  time: 171.07  251 474
saxjs                          - total: 706.31  time: 699.01  251 474
libxml                         - total: 1469.16 time: 1463.54 0 0
saxwasm-zero                   - total: 602.57  time: 168.41  0 0
saxwasm-full                   - total: 1772.74 time: 1239.84 251 206
saxwasm-abc                    - total: 1493.13 time: 995.89  251 206
expat                          - total: 1410.86 time: 1399.94 251 618
expat buffer                   - total: 1587.27 time: 1481.29 251 618
easysax ns=on  uq=on  attr=on  - total: 156.72  time: 151.38  251 474
easysax ns=off uq=on  attr=on  - total: 104.14  time: 99.65   251 474
easysax ns=off uq=off attr=on  - total: 69.83   time: 67.09   251 474
easysax ns=off uq=off attr=off - total: 66.40   time: 64.11   251 474
-------------------------------------------
```


**sh: node bench-03.js**
```
count - 1000
size - 121786
-------------------------------------------
ltx                            - total: 1006.80 time: 998.72  1366 2141
saxophone                      - total: 1570.31 time: 1556.65 1366 2144
saxen   ns=off uq=on  attr=on  - total: 1248.35 time: 1243.48 1366 2141
saxjs                          - total: 5889.32 time: 5879.55 1366 2143
libxml                         - total: 7518.56 time: 7512.21 0 0
saxwasm-zero                   - total: 1484.29 time: 863.42  0 0
saxwasm-full                   - total: 12910.9 time: 11333.5 1366 677
saxwasm-abc                    - total: 8161.11 time: 6984.17 1366 677
expat                          - total: 8685.72 time: 8672.57 1366 4857
expat buffer                   - total: 9057.83 time: 8814.37 1366 4857
easysax ns=on  uq=on  attr=on  - total: 1132.62 time: 1126.22 1365 2142
easysax ns=off uq=on  attr=on  - total: 791.49  time: 784.49  1366 2142
easysax ns=off uq=off attr=on  - total: 639.72  time: 635.29  1366 2142
easysax ns=off uq=off attr=off - total: 454.91  time: 450.58  1366 2142
-------------------------------------------
```




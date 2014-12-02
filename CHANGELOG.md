<a name="0.0.20"></a>
### 0.0.20 (2014-12-02)


#### Bug Fixes

* **manager:**
  * display spinner until pre/post functions are called ([1e97679f](https://github.com/ProjectImplicit/PIquest/commit/1e97679f91ea9433e3442088b14388d7bee80f96))
  * manager.jsp now works correctly ([69c5ec87](https://github.com/ProjectImplicit/PIquest/commit/69c5ec87df52e323482aa3f92b3c8ab9789149d8))
* **pip:** correct lib urls ([fc665cea](https://github.com/ProjectImplicit/PIquest/commit/fc665cea0d2e4e71048302f4f8b720d2ecc61e52))


#### Features

* **manager:** support relative paths ([5ae8645e](https://github.com/ProjectImplicit/PIquest/commit/5ae8645e3da505420065bfa1f7fa79fc72dbb3c8))
* **pip:** support for pip tasks ([5929fe39](https://github.com/ProjectImplicit/PIquest/commit/5929fe391c5cf713f4cc9d2fb0f817631cd82b1d))
* **styles:** pull pip styles and change location of scss files ([a689f83d](https://github.com/ProjectImplicit/PIquest/commit/a689f83d988fab5046e84976e434acb153aa7405))


<a name="0.0.19"></a>
### 0.0.19 (2014-11-23)


#### Bug Fixes

* **IE8:** fixes problem loading IE8, and a style issue ([4a373de1](https://github.com/ProjectImplicit/PIquest/commit/4a373de1e5193bd4956cff81e6841df6c1538def))
* **jsp:** fix breaking typo of main.css ([accc15dd](https://github.com/ProjectImplicit/PIquest/commit/accc15dd8bca9181b135694d4d83cec0b2c7092d))
* **logger:** player proceeds correctly even when logging fails.. fix(manager): manager recogn ([18a46887](https://github.com/ProjectImplicit/PIquest/commit/18a4688739da76b6d1265e450334c105b13a2c3a), closes [#58](https://github.com/ProjectImplicit/PIquest/issues/58))
* **manager:** move onEnd to the settings object ([a11362bc](https://github.com/ProjectImplicit/PIquest/commit/a11362bc13b65ab8c295b55976f980f1d8e5a32f))
* **readme:** animation -> animate ([6e17a252](https://github.com/ProjectImplicit/PIquest/commit/6e17a252b37cfc1cbb0acc4fa39336ecbba6595b))
* **task:**
  * no longer breaks in dist ([6498e718](https://github.com/ProjectImplicit/PIquest/commit/6498e7189276b4d0b80f681239860428ca8b2bf9))
  * run onEnd after sending ([e6a6799c](https://github.com/ProjectImplicit/PIquest/commit/e6a6799ce795aca42ac4552b24df57bba6c481b6))
  * does not log in pulses at the end of the task. ([a48f9323](https://github.com/ProjectImplicit/PIquest/commit/a48f93231e1c6bc64d5a9a7d5cf79b64b7b45c3c), closes [#49](https://github.com/ProjectImplicit/PIquest/issues/49))


#### Features

* **DEBUG:** full support for debug with control over tags and levels. ([837d6f6d](https://github.com/ProjectImplicit/PIquest/commit/837d6f6dd4b79b487790349a292017524c92ccb7), closes [#17](https://github.com/ProjectImplicit/PIquest/issues/17))
* **animation:** support for slide, fade and drop-in. ([aa142a24](https://github.com/ProjectImplicit/PIquest/commit/aa142a2464b1c5934bd4c9b1821e980fc9956255))
* **console:**
  * log errors correctly (message to screen, full error to console) ([03005cdf](https://github.com/ProjectImplicit/PIquest/commit/03005cdf37b97ec667e6a576f227dbcf30a23ca3))
  * conditional pi-console on production ([95c0457b](https://github.com/ProjectImplicit/PIquest/commit/95c0457b01cb562dadfa25fce2a8515a3f69ea91))
  * Move DEBUG properties to a central location. Solves #17. ([736cf417](https://github.com/ProjectImplicit/PIquest/commit/736cf417d96c343ee3d3da7c3b8dcd54c884688a))
* **css:** set sass to compress css ([cb5d13f6](https://github.com/ProjectImplicit/PIquest/commit/cb5d13f6c523b42f12eda08b7a2d475fe1721aaa))
* **manager:**
  * log errors and currentTask ([5752b121](https://github.com/ProjectImplicit/PIquest/commit/5752b121487085ed91d61b3d51dda8f264426bb8))
  * moved loading logic from task to manager, and support loading of html as well as ([a8920b4d](https://github.com/ProjectImplicit/PIquest/commit/a8920b4da52a2e73c0ee2a3471eeb0a536e912d5))
  * invoke pre/post task functions ([161655fd](https://github.com/ProjectImplicit/PIquest/commit/161655fd398e421adbbb92ded036a25f1ede7a9f))
  * support settings.onPreTask hook. Advances #54. ([b98b1c2b](https://github.com/ProjectImplicit/PIquest/commit/b98b1c2b78cc5bc4aae71b136e050dacf34639f9))
  * create manager API ([d034e22c](https://github.com/ProjectImplicit/PIquest/commit/d034e22cefa733ad05222ec11149113629e6c52b))
  * create separate manager.jsp fix(manager): prevent failure when the script expres ([0a5d13bd](https://github.com/ProjectImplicit/PIquest/commit/0a5d13bd120f5edbbbf450681cc79167d944ec60))
  * a directive that supports a single task. ([463ec8ab](https://github.com/ProjectImplicit/PIquest/commit/463ec8abfd8084ada48488aac47382c95b834c59), closes [#56](https://github.com/ProjectImplicit/PIquest/issues/56))
  * support spinner. ([d0533b90](https://github.com/ProjectImplicit/PIquest/commit/d0533b90c18cb6e845659e4f3254a318a622577e), closes [#53](https://github.com/ProjectImplicit/PIquest/issues/53))
  * manager up and going, still not ready for full use ([aad9c900](https://github.com/ProjectImplicit/PIquest/commit/aad9c9006f746c3bc3cebd98089b34e7e26d75d4))
  * taskLoadProvider now stores the script in ([b0da92ec](https://github.com/ProjectImplicit/PIquest/commit/b0da92ec1ab3c095a915a0eca0285472fe776d8f))
  * managerSequence, creates sequence+db for the manager ([22780504](https://github.com/ProjectImplicit/PIquest/commit/22780504bca042a698f9418d99c1f0af5acdd5c8))
  * created the managerProvider (comunications between sequence and directive) ([c9740430](https://github.com/ProjectImplicit/PIquest/commit/c9740430965e80095956314c42f2da3e33d10fa5))
* **message:**
  * support proceeding using 'keys' ([634d1358](https://github.com/ProjectImplicit/PIquest/commit/634d135849d12201ab06a316d584f743c5ca3630))
  * created message module and added it into piManager ([8f79d258](https://github.com/ProjectImplicit/PIquest/commit/8f79d2583cb747a683b877d38fdc1e10863564b3))
* **piQuest:** support for animation. advances #48 ([d3be11e8](https://github.com/ProjectImplicit/PIquest/commit/d3be11e82699bc0ae4e817af4f488d54d20bf139))
* **select:** selectOne and selectMulti cannot be highlighted any more. ([9aa87e7e](https://github.com/ProjectImplicit/PIquest/commit/9aa87e7e1c3fd7e98db1f8cb5c50ec86746745b3), closes [#50](https://github.com/ProjectImplicit/PIquest/issues/50))


#### Breaking Changes

* The DEBUG property of many stuff doesn't work any more. To migrate, activate centraly from the main settings.DEBUG.
 ([736cf417](https://github.com/ProjectImplicit/PIquest/commit/736cf417d96c343ee3d3da7c3b8dcd54c884688a))
* by default animation is not activated, you must manually activate it by setting the class name in /`animation/`.
 ([aa142a24](https://github.com/ProjectImplicit/PIquest/commit/aa142a2464b1c5934bd4c9b1821e980fc9956255))


<a name="0.0.18"></a>
### 0.0.18 (2014-11-11)


#### Bug Fixes

* **logger:** player proceeds correctly even when logging fails.. fix(manager): manager recogn ([18a46887](https://github.com/ProjectImplicit/PIquest/commit/18a4688739da76b6d1265e450334c105b13a2c3a), closes [#58](https://github.com/ProjectImplicit/PIquest/issues/58))


#### Features

* **manager:**
  * support spinner. ([d0533b90](https://github.com/ProjectImplicit/PIquest/commit/d0533b90c18cb6e845659e4f3254a318a622577e), closes [#53](https://github.com/ProjectImplicit/PIquest/issues/53))
  * manager up and going, still not ready for full use ([aad9c900](https://github.com/ProjectImplicit/PIquest/commit/aad9c9006f746c3bc3cebd98089b34e7e26d75d4))


<a name="0.0.17"></a>
### 0.0.17 (2014-11-02)


#### Bug Fixes

* **task:** no longer breaks in dist ([6498e718](https://github.com/ProjectImplicit/PIquest/commit/6498e7189276b4d0b80f681239860428ca8b2bf9))


#### Features

* **DEBUG:** full support for debug with control over tags and levels. ([837d6f6d](https://github.com/ProjectImplicit/PIquest/commit/837d6f6dd4b79b487790349a292017524c92ccb7), closes [#17](https://github.com/ProjectImplicit/PIquest/issues/17))
* **console:** conditional pi-console on production ([95c0457b](https://github.com/ProjectImplicit/PIquest/commit/95c0457b01cb562dadfa25fce2a8515a3f69ea91))
* **manager:**
  * taskLoadProvider now stores the script in ([b0da92ec](https://github.com/ProjectImplicit/PIquest/commit/b0da92ec1ab3c095a915a0eca0285472fe776d8f))
  * managerSequence, creates sequence+db for the manager ([22780504](https://github.com/ProjectImplicit/PIquest/commit/22780504bca042a698f9418d99c1f0af5acdd5c8))
  * created the managerProvider (comunications between sequence and directive) ([c9740430](https://github.com/ProjectImplicit/PIquest/commit/c9740430965e80095956314c42f2da3e33d10fa5))


<a name="0.0.16"></a>
### 0.0.16 (2014-10-23)


#### Bug Fixes

* **readme:** animation -> animate ([6e17a252](https://github.com/ProjectImplicit/PIquest/commit/6e17a252b37cfc1cbb0acc4fa39336ecbba6595b))


#### Features

* **DEBUG:** full support for debug with control over tags and levels. ([e21d41ef](https://github.com/ProjectImplicit/PIquest/commit/e21d41ef421c4d56fbab617cd423073cae0a7e0c), closes [#17](https://github.com/ProjectImplicit/PIquest/issues/17))
* **console:** Move DEBUG properties to a central location. Solves #17. ([736cf417](https://github.com/ProjectImplicit/PIquest/commit/736cf417d96c343ee3d3da7c3b8dcd54c884688a))


#### Breaking Changes

* The DEBUG property of many stuff doesn't work any more. To migrate, activate centraly from the main settings.DEBUG.
 ([736cf417](https://github.com/ProjectImplicit/PIquest/commit/736cf417d96c343ee3d3da7c3b8dcd54c884688a))


<a name="0.0.15"></a>
### 0.0.15 (2014-10-19)


#### Bug Fixes

* **task:** run onEnd after sending ([e6a6799c](https://github.com/ProjectImplicit/PIquest/commit/e6a6799ce795aca42ac4552b24df57bba6c481b6))


<a name="0.0.14"></a>
### 0.0.14 (2014-10-08)


#### Bug Fixes

* **task:** does not log in pulses at the end of the task. ([a48f9323](https://github.com/ProjectImplicit/PIquest/commit/a48f93231e1c6bc64d5a9a7d5cf79b64b7b45c3c), closes [#49](https://github.com/ProjectImplicit/PIquest/issues/49))


#### Features

* **animation:** support for slide, fade and drop-in. ([aa142a24](https://github.com/ProjectImplicit/PIquest/commit/aa142a2464b1c5934bd4c9b1821e980fc9956255))
* **select:** selectOne and selectMulti cannot be highlighted any more. ([9aa87e7e](https://github.com/ProjectImplicit/PIquest/commit/9aa87e7e1c3fd7e98db1f8cb5c50ec86746745b3), closes [#50](https://github.com/ProjectImplicit/PIquest/issues/50))


#### Breaking Changes

* by default animation is not activated, you must manually activate it by setting the class name in /`animation/`.
 ([aa142a24](https://github.com/ProjectImplicit/PIquest/commit/aa142a2464b1c5934bd4c9b1821e980fc9956255))


<a name="0.0.13"></a>
### 0.0.13 (2014-10-06)


#### Bug Fixes

* **IE8:** fixes problem loading IE8, and a style issue ([4a373de1](https://github.com/ProjectImplicit/PIquest/commit/4a373de1e5193bd4956cff81e6841df6c1538def))
* **jsp:** fix breaking typo of main.css ([accc15dd](https://github.com/ProjectImplicit/PIquest/commit/accc15dd8bca9181b135694d4d83cec0b2c7092d))


#### Features

* **Gruntfile:** switched build to include sass. ([12f7d04e](https://github.com/ProjectImplicit/PIquest/commit/12f7d04e059d90fdd5fb03d9f480d9821d6ab472))
* **piQuest:** support for animation. advances #48 ([d3be11e8](https://github.com/ProjectImplicit/PIquest/commit/d3be11e82699bc0ae4e817af4f488d54d20bf139))


<a name="0.0.12"></a>
### 0.0.12 (2014-09-30)


#### Features

* **Gruntfile:** switched build to include sass. ([12f7d04e](https://github.com/ProjectImplicit/PIquest/commit/12f7d04e059d90fdd5fb03d9f480d9821d6ab472))
* **questSequence:** support page.questions = single question ([e2225460](https://github.com/ProjectImplicit/PIquest/commit/e2225460b7621f7ad9a8be9ec721cdb7d2f37f9f))
* **sequence:** allow no question arr ([eb0b2c59](https://github.com/ProjectImplicit/PIquest/commit/eb0b2c59ce942d7e436a645ba658f40dfca372d3))


<a name="0.0.11"></a>
### 0.0.11 (2014-09-28)


#### Features

* **questSequence:** support page.questions = single question ([e2225460](https://github.com/ProjectImplicit/PIquest/commit/e2225460b7621f7ad9a8be9ec721cdb7d2f37f9f))
* **sequence:** allow no question arr ([eb0b2c59](https://github.com/ProjectImplicit/PIquest/commit/eb0b2c59ce942d7e436a645ba658f40dfca372d3))
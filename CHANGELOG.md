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
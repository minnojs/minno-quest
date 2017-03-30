<a name"0.1.14"></a>
### 0.1.14 (2017-03-30)


#### Features

* **perf:** data encode spinner, remove double requirejs ([cf12ab7d](https://github.com/ProjectImplicit/PIquest/commit/cf12ab7d))


<a name"0.1.13"></a>
### 0.1.13 (2017-03-16)


#### Bug Fixes

* **PI:** showFeedback works correctly event if current is still set ([d62e3cdb](https://github.com/ProjectImplicit/PIquest/commit/d62e3cdb))


<a name"0.1.12"></a>
### 0.1.12 (2017-03-14)


#### Bug Fixes

* **PI:** debrief error ([85a789a0](https://github.com/ProjectImplicit/PIquest/commit/85a789a0))


<a name"0.1.11"></a>
### 0.1.11 (2017-03-09)


#### Bug Fixes

* **gendocs:** install using npm ([b49b511c](https://github.com/ProjectImplicit/PIquest/commit/b49b511c))
* **sequencer:** merge objects now overides parent values ([a0852877](https://github.com/ProjectImplicit/PIquest/commit/a0852877))


#### Features

* **PI:** messages.isTouch ([ac4f6ada](https://github.com/ProjectImplicit/PIquest/commit/ac4f6ada))
* **docs:** move docs to main dir ([df70d623](https://github.com/ProjectImplicit/PIquest/commit/df70d623))


<a name"0.1.10"></a>
### 0.1.10 (2017-01-05)


#### Bug Fixes

* **selectOne:** focused button now have the corect color ([27bfa39d](https://github.com/ProjectImplicit/PIquest/commit/27bfa39d))


#### Features

* **pip:** added support for baseUrl in pip tasks ([337e9ea0](https://github.com/ProjectImplicit/PIquest/commit/337e9ea0))


<a name"0.1.9"></a>
### 0.1.9 (2016-11-20)


#### Features

* **questDirectives:** added pattern validation to multiGrid ([afe1216d](https://github.com/ProjectImplicit/PIquest/commit/afe1216d))


<a name"0.1.8"></a>
### 0.1.8 (2016-11-15)


#### Bug Fixes

* **PI:** fix PI urls ([c5d253d0](https://github.com/ProjectImplicit/PIquest/commit/c5d253d0))
* **questDirectives:** multiGrid.dropdown has an empty value now ([21b58860](https://github.com/ProjectImplicit/PIquest/commit/21b58860))


#### Features

* **questDirectives:** multiGrid.required ([7dbf1e9b](https://github.com/ProjectImplicit/PIquest/commit/7dbf1e9b))


<a name"0.1.7"></a>
### 0.1.7 (2016-11-13)


#### Bug Fixes

* **questDirectives:** slider updates only on mouseup so that redraw doesn't break it ([11343115](https://github.com/ProjectImplicit/PIquest/commit/11343115))


#### Features

* **manager:**
  * improve error message for failed requests. ([e7ffcc9d](https://github.com/ProjectImplicit/PIquest/commit/e7ffcc9d), closes [#146](https://github.com/ProjectImplicit/PIquest/issues/146))
  * allow 'skip' only when DEBUG is set to true ([cc26e47d](https://github.com/ProjectImplicit/PIquest/commit/cc26e47d))
* **questDirectives:**
  * multiGrid ([50cba478](https://github.com/ProjectImplicit/PIquest/commit/50cba478))
  * added input type to grid ([cc5f060e](https://github.com/ProjectImplicit/PIquest/commit/cc5f060e))


<a name"0.1.6"></a>
### 0.1.6 (2016-09-18)


#### Features

* **logger:** added logger.error so that errors in posting can be managed. ([fd7c66bf](https://github.com/ProjectImplicit/PIquest/commit/fd7c66bf))


<a name"0.1.5"></a>
### 0.1.5 (2016-09-16)


#### Features

* **PI:**
  * add global meta to API.save posts ([89c5868e](https://github.com/ProjectImplicit/PIquest/commit/89c5868e))
  * fit manager to serverless paradigm ([7f2cfa08](https://github.com/ProjectImplicit/PIquest/commit/7f2cfa08))


<a name"0.1.4"></a>
### 0.1.4 (2016-09-04)


#### Features

* **questDirectives:** change rank.noRandomize into rank.randomize ([e12874e4](https://github.com/ProjectImplicit/PIquest/commit/e12874e4))


<a name"0.1.3"></a>
### 0.1.3 (2016-09-04)


<a name"0.1.2"></a>
### 0.1.2 (2016-09-04)


#### Bug Fixes

* **questDirectives:** rank - clicking a row does not navigate away any more ([aa2927e0](https://github.com/ProjectImplicit/PIquest/commit/aa2927e0))


<a name"0.1.1"></a>
### 0.1.1 (2016-09-04)


#### Bug Fixes

* **PI:**
  * added global. to manager posts ([4aff2981](https://github.com/ProjectImplicit/PIquest/commit/4aff2981))
  * move manager no-cache from requirejs bustUrl to meta content=no-store ([e7bc513a](https://github.com/ProjectImplicit/PIquest/commit/e7bc513a))
* **database:** regenerate templates that have been inherited correctly ([a9bef97c](https://github.com/ProjectImplicit/PIquest/commit/a9bef97c))
* **preload:** support IE8 ([cee2f3e3](https://github.com/ProjectImplicit/PIquest/commit/cee2f3e3))
* **questController:** treat undefined values correctly ([1f739bc5](https://github.com/ProjectImplicit/PIquest/commit/1f739bc5))
* **questDirective:** make sure the ngModel unregisters from the form after every redraw ([af1810a9](https://github.com/ProjectImplicit/PIquest/commit/af1810a9))
* **sequencer:** branch:equals now returns false when comparing to a nonexistant variable ([36f17a25](https://github.com/ProjectImplicit/PIquest/commit/36f17a25))


#### Features

* **PI:**
  * noDonate - hide allow hiding donate button in debrief ([ff0132cb](https://github.com/ProjectImplicit/PIquest/commit/ff0132cb))
  * auto log global. ([1c5d0ae2](https://github.com/ProjectImplicit/PIquest/commit/1c5d0ae2))
* **manager:**
  * default progress-bar ([a8db58d3](https://github.com/ProjectImplicit/PIquest/commit/a8db58d3))
  * added support for links out ([2d132382](https://github.com/ProjectImplicit/PIquest/commit/2d132382))
  * support pre and post text ([b8b54d1e](https://github.com/ProjectImplicit/PIquest/commit/b8b54d1e))
  * support "skin" option ([28b3bf1e](https://github.com/ProjectImplicit/PIquest/commit/28b3bf1e))
* **mixer:**
  * custom mixer ([fc17fc16](https://github.com/ProjectImplicit/PIquest/commit/fc17fc16))
  * re-added condition.DEBUG ([3ff29703](https://github.com/ProjectImplicit/PIquest/commit/3ff29703))
* **preload:** added error logging ([17b99e29](https://github.com/ProjectImplicit/PIquest/commit/17b99e29))
* **questDirectives:** rank question ([f8b6ccc9](https://github.com/ProjectImplicit/PIquest/commit/f8b6ccc9))


<a name"0.1.0"></a>
## 0.1.0 (2016-05-05)


#### Features

* **manager:**
  * support pre and post text ([b8b54d1e](https://github.com/ProjectImplicit/PIquest/commit/b8b54d1e))
  * support "skin" option ([28b3bf1e](https://github.com/ProjectImplicit/PIquest/commit/28b3bf1e))


<a name"0.0.86"></a>
### 0.0.86 (2016-05-03)


#### Features

* **manager:**
  * support pre and post text ([b8b54d1e](https://github.com/ProjectImplicit/PIquest/commit/b8b54d1e))
  * support "skin" option ([28b3bf1e](https://github.com/ProjectImplicit/PIquest/commit/28b3bf1e))


<a name"0.0.85"></a>
### 0.0.85 (2016-03-22)


#### Features

* **manager:** support "skin" option ([28b3bf1e](https://github.com/ProjectImplicit/PIquest/commit/28b3bf1e))


<a name"0.0.84"></a>
### 0.0.84 (2016-03-15)


#### Bug Fixes

* **pi:** update donate button ([47fe160b](https://github.com/ProjectImplicit/PIquest/commit/47fe160b))


<a name"0.0.83"></a>
### 0.0.83 (2016-03-14)


#### Features

* **PI:** added donation button to debriefing page ([411ba37e](https://github.com/ProjectImplicit/PIquest/commit/411ba37e))
* **manager:** always bust cache ([9e721ee6](https://github.com/ProjectImplicit/PIquest/commit/9e721ee6))


<a name"0.0.82"></a>
### 0.0.82 (2016-03-10)


#### Features

* **PI:** added donation button to debriefing page ([411ba37e](https://github.com/ProjectImplicit/PIquest/commit/411ba37e))


<a name"0.0.81"></a>
### 0.0.81 (2016-03-06)


#### Bug Fixes

* **modal:**
  * this time fix css regression? ([240dd4ec](https://github.com/ProjectImplicit/PIquest/commit/240dd4ec))
  * css regression ([b89991b7](https://github.com/ProjectImplicit/PIquest/commit/b89991b7))


<a name"0.0.80"></a>
### 0.0.80 (2016-03-06)


#### Bug Fixes

* **modal:** css regression ([b89991b7](https://github.com/ProjectImplicit/PIquest/commit/b89991b7))


<a name"0.0.79"></a>
### 0.0.79 (2016-02-18)


#### Bug Fixes

* **PI:** updated debrief urls ([11785ad9](https://github.com/ProjectImplicit/PIquest/commit/11785ad9))
* **page:** autoFocus now only focuses on elements in the first question ([a370e782](https://github.com/ProjectImplicit/PIquest/commit/a370e782))


<a name"0.0.78"></a>
### 0.0.78 (2016-02-18)


#### Bug Fixes

* **page:** autoFocus now only focuses on elements in the first question ([a370e782](https://github.com/ProjectImplicit/PIquest/commit/a370e782))


<a name"0.0.77"></a>
### 0.0.77 (2016-02-07)


#### Features

* **piqPage:** autoFocus on first input in page ([196c927b](https://github.com/ProjectImplicit/PIquest/commit/196c927b))


<a name"0.0.76"></a>
### 0.0.76 (2016-01-15)


#### Bug Fixes

* **message:** support tasksData for templateUrls ([94085a4a](https://github.com/ProjectImplicit/PIquest/commit/94085a4a))


#### Features

* **manager:** added callback for task load ([38a24948](https://github.com/ProjectImplicit/PIquest/commit/38a24948))


<a name"0.0.75"></a>
### 0.0.75 (2015-12-24)


#### Bug Fixes

* **IE:** IE8 now works - fixed bootstrapped elements ([2ef481de](https://github.com/ProjectImplicit/PIquest/commit/2ef481de))


<a name"0.0.74"></a>
### 0.0.74 (2015-12-24)


#### Bug Fixes

* **page:** prev now works again ([6cf5e800](https://github.com/ProjectImplicit/PIquest/commit/6cf5e800))


<a name"0.0.73"></a>
### 0.0.73 (2015-12-20)


#### Bug Fixes

* **questDirectives:**
  * validation should show only after the first submit attempt ([48df6b5f](https://github.com/ProjectImplicit/PIquest/commit/48df6b5f))
  * allow rowStemCss to affect stem width ([a10ea9a2](https://github.com/ProjectImplicit/PIquest/commit/a10ea9a2))


<a name"0.0.72"></a>
### 0.0.72 (2015-12-17)


<a name"0.0.71"></a>
### 0.0.71 (2015-12-17)


#### Bug Fixes

* **bootstrap:** remove angular defer bootstrap from dist ([53d84734](https://github.com/ProjectImplicit/PIquest/commit/53d84734))
* **style:** prevent cutting off of bottom of decline bottom when chrome zooms ([a0e888ad](https://github.com/ProjectImplicit/PIquest/commit/a0e888ad))


#### Features

* **bootstrap:** allow manual bootstrap (maybe solve the missing resumeBootstrap bug?) ([938e31ad](https://github.com/ProjectImplicit/PIquest/commit/938e31ad))
* **manager:** warn for repeating task names ([0625c284](https://github.com/ProjectImplicit/PIquest/commit/0625c284))
* **mixer:**
  * add n to weighted random so it compares with choose. Changed weightedRandom into ([c82120da](https://github.com/ProjectImplicit/PIquest/commit/c82120da), closes [#130](https://github.com/ProjectImplicit/PIquest/issues/130))
  * add deep mixing to choose and weighted random. ([b9c18c8b](https://github.com/ProjectImplicit/PIquest/commit/b9c18c8b), closes [#129](https://github.com/ProjectImplicit/PIquest/issues/129))


<a name"0.0.70"></a>
### 0.0.70 (2015-12-17)


#### Bug Fixes

* **style:** prevent cutting off of bottom of decline bottom when chrome zooms ([a0e888ad](https://github.com/ProjectImplicit/PIquest/commit/a0e888ad))


#### Features

* **bootstrap:** allow manual bootstrap (maybe solve the missing resumeBootstrap bug?) ([938e31ad](https://github.com/ProjectImplicit/PIquest/commit/938e31ad))
* **manager:** warn for repeating task names ([0625c284](https://github.com/ProjectImplicit/PIquest/commit/0625c284))
* **mixer:**
  * add n to weighted random so it compares with choose. Changed weightedRandom into ([c82120da](https://github.com/ProjectImplicit/PIquest/commit/c82120da), closes [#130](https://github.com/ProjectImplicit/PIquest/issues/130))
  * add deep mixing to choose and weighted random. ([b9c18c8b](https://github.com/ProjectImplicit/PIquest/commit/b9c18c8b), closes [#129](https://github.com/ProjectImplicit/PIquest/issues/129))


<a name"0.0.69"></a>
### 0.0.69 (2015-12-03)


#### Features

* **questDirectives:** warn for nameless questions ([f34d390d](https://github.com/ProjectImplicit/PIquest/commit/f34d390d))


<a name"0.0.68"></a>
### 0.0.68 (2015-12-03)


#### Bug Fixes

* **mobile:** allow quick doublclicks with fastClick ([2d39c955](https://github.com/ProjectImplicit/PIquest/commit/2d39c955))


<a name"0.0.67"></a>
### 0.0.67 (2015-12-03)


#### Bug Fixes

* **mobile:** add fastclick to prevent 300ms delay on click ([92e865b8](https://github.com/ProjectImplicit/PIquest/commit/92e865b8))


<a name"0.0.66"></a>
### 0.0.66 (2015-11-29)


#### Bug Fixes

* **questDirectives:** dropdown required error message now works ([8870fca4](https://github.com/ProjectImplicit/PIquest/commit/8870fca4))


<a name"0.0.65"></a>
### 0.0.65 (2015-11-18)


#### Bug Fixes

* **PI:** jsp files prevent zoom on mobile ([6913f770](https://github.com/ProjectImplicit/PIquest/commit/6913f770))
* **questDirectives:** slider can now be dragged after a click on the slider bar ([203bea2a](https://github.com/ProjectImplicit/PIquest/commit/203bea2a))


#### Features

* **quest:** global timer ([2e4f764f](https://github.com/ProjectImplicit/PIquest/commit/2e4f764f))


<a name"0.0.64"></a>
### 0.0.64 (2015-11-06)


#### Features

* **manager:**
  * support injectStyle ([fc45b44f](https://github.com/ProjectImplicit/PIquest/commit/fc45b44f))
  * redirect task ([e4262554](https://github.com/ProjectImplicit/PIquest/commit/e4262554))


<a name"0.0.63"></a>
### 0.0.63 (2015-11-05)


#### Bug Fixes

* **taskDirective:** cancel beforeUnload function ([790eab1a](https://github.com/ProjectImplicit/PIquest/commit/790eab1a))


<a name"0.0.62"></a>
### 0.0.62 (2015-10-30)


#### Bug Fixes

* **PI:** post taskURL as part of the pre task update ([8ca521f1](https://github.com/ProjectImplicit/PIquest/commit/8ca521f1))
* **manager:**
  * clarify error message for bad syntax in task script ([8b02cf85](https://github.com/ProjectImplicit/PIquest/commit/8b02cf85))
  * do not flash elements pre-rendering ([f384895a](https://github.com/ProjectImplicit/PIquest/commit/f384895a))


<a name"0.0.61"></a>
### 0.0.61 (2015-10-25)


#### Bug Fixes

* **PI:** more tweaking of the message templating system ([dc717723](https://github.com/ProjectImplicit/PIquest/commit/dc717723))


<a name"0.0.60"></a>
### 0.0.60 (2015-10-25)


#### Bug Fixes

* **PI:** fixed templating for showFeedback ([70e398df](https://github.com/ProjectImplicit/PIquest/commit/70e398df))
* **message:** throw an error if missing a template ([1c39d8b1](https://github.com/ProjectImplicit/PIquest/commit/1c39d8b1))


<a name"0.0.59"></a>
### 0.0.59 (2015-10-22)


#### Features

* **PI:** support showFeedback in piQuest, add demo option to debriefing ([666f63c0](https://github.com/ProjectImplicit/PIquest/commit/666f63c0))


<a name"0.0.57"></a>
### 0.0.57 (2015-10-16)


#### Bug Fixes

* **console:** default warning level should be 'warn' ([8691eae1](https://github.com/ProjectImplicit/PIquest/commit/8691eae1))
* **manager:** make sure the manager directive closes everything that it began ([1e3a7e03](https://github.com/ProjectImplicit/PIquest/commit/1e3a7e03))


<a name"0.0.56"></a>
### 0.0.56 (2015-10-15)


#### Bug Fixes

* **questDirectives:** slider support for android. ([a1b7f458](https://github.com/ProjectImplicit/PIquest/commit/a1b7f458), closes [#126](https://github.com/ProjectImplicit/PIquest/issues/126))


<a name"0.0.55"></a>
### 0.0.55 (2015-10-08)


#### Bug Fixes

* **questDirectives:** correct validation does not show unless page is submitted. ([77eca974](https://github.com/ProjectImplicit/PIquest/commit/77eca974), closes [#121](https://github.com/ProjectImplicit/PIquest/issues/121))


#### Features

* **mixer:** support mixer.wrapper. ([febf7fcc](https://github.com/ProjectImplicit/PIquest/commit/febf7fcc), closes [#120](https://github.com/ProjectImplicit/PIquest/issues/120))
* **questDirectives:** added info question. ([f1bc1c67](https://github.com/ProjectImplicit/PIquest/commit/f1bc1c67), closes [#122](https://github.com/ProjectImplicit/PIquest/issues/122))


<a name"0.0.54"></a>
### 0.0.54 (2015-09-24)


#### Bug Fixes

* **piqPage:**
  * fixed window mocking for scrollTo ([5c3221d5](https://github.com/ProjectImplicit/PIquest/commit/5c3221d5))
  * scroll to top on new page ([167170ad](https://github.com/ProjectImplicit/PIquest/commit/167170ad))


<a name"0.0.53"></a>
### 0.0.53 (2015-09-20)


#### Bug Fixes

* **PI:** mturk post changed into redirect post last task ([ca291754](https://github.com/ProjectImplicit/PIquest/commit/ca291754))


#### Features

* **tasks:** created post task ([68cae356](https://github.com/ProjectImplicit/PIquest/commit/68cae356))


<a name"0.0.52"></a>
### 0.0.52 (2015-09-10)


#### Bug Fixes

* **piModal:** style show ([86c2af42](https://github.com/ProjectImplicit/PIquest/commit/86c2af42))
* **select:** mixer required does not screw up the response anymore ([31794373](https://github.com/ProjectImplicit/PIquest/commit/31794373))
* **skip:** skip refresh now works correctly ([3437cfe0](https://github.com/ProjectImplicit/PIquest/commit/3437cfe0))


#### Features

* **PI:**
  * allow hiding button in templates ([bb9d5ac3](https://github.com/ProjectImplicit/PIquest/commit/bb9d5ac3))
  * support mTurk ([bcbb6a34](https://github.com/ProjectImplicit/PIquest/commit/bcbb6a34))


<a name"0.0.51"></a>
### 0.0.51 (2015-09-01)


#### Bug Fixes

* **sequencer:** random now recursively mixes sub mixer ([08cd0cc6](https://github.com/ProjectImplicit/PIquest/commit/08cd0cc6))
* **slider:** showTicks no longer prebents dragging the handle ([f3594480](https://github.com/ProjectImplicit/PIquest/commit/f3594480))


<a name="0.0.50"></a>
### 0.0.50 (2015-07-05)


#### Bug Fixes

* **sequencer:** support nested templating. ([c985e9e9](https://github.com/ProjectImplicit/PIquest/commit/c985e9e9dbf3971f1e080fba38632255e891164d), closes [#116](https://github.com/ProjectImplicit/PIquest/issues/116))


#### Features

* **database:** support local addGlobal && addCurrent ([05324dc4](https://github.com/ProjectImplicit/PIquest/commit/05324dc4256766fe37e1092d132058733fb1203c))


<a name="0.0.49"></a>
### 0.0.49 (2015-06-14)


#### Bug Fixes

* **manager:** register context for mixer and templates ([859199ac](https://github.com/ProjectImplicit/PIquest/commit/859199acd6096abf55598370fb4f99bcf116f0a9))
* **questDirectives:** remove exclamation mark from from required error message ([d86e9cf2](https://github.com/ProjectImplicit/PIquest/commit/d86e9cf248658d22b43d1321f5657b9aeffcec1d))


<a name="0.0.48"></a>
### 0.0.48 (2015-06-09)


#### Bug Fixes

* **angular:** push NG_DEFER_BOOTSTRAP to be before angular loading ([7faf7868](https://github.com/ProjectImplicit/PIquest/commit/7faf7868711294d3c50558b2cd75fb137cd8d50e))
* **manager:** manager directive on load spinner now works ([5d0284a6](https://github.com/ProjectImplicit/PIquest/commit/5d0284a63b1182830237da5902101df597da62e8))
* **requirejs:** set waitSeconds to 120 in production to prevent load timeouts ([8923ab5e](https://github.com/ProjectImplicit/PIquest/commit/8923ab5e4454cb2493a837219d6a3b2a30c48761))


#### Features

* **database:** deep template by default, we manually exclude un-templatable properties ([9e275b80](https://github.com/ProjectImplicit/PIquest/commit/9e275b80e8242672d9a671aa8a2aec01c06f8efa))
* **questDirectives:**
  * slider support for showTicks. ([54ff48d7](https://github.com/ProjectImplicit/PIquest/commit/54ff48d7c50df0508d71a0a80464a282c72f9f4e), closes [#110](https://github.com/ProjectImplicit/PIquest/issues/110))
  * slider highlightDirection ([9e792b20](https://github.com/ProjectImplicit/PIquest/commit/9e792b209099cf34395a31eaa4959babc6d78629), closes [#113](https://github.com/ProjectImplicit/PIquest/issues/113))


<a name="0.0.47"></a>
### 0.0.47 (2015-05-28)


#### Features

* **questDirectives:**
  * grid support for checkboxType. ([50f6bc4a](https://github.com/ProjectImplicit/PIquest/commit/50f6bc4a1fea63bc9b65ea01a69a07f58e7ee486), closes [#112](https://github.com/ProjectImplicit/PIquest/issues/112))
  * grid support for column.css ([61ae7a30](https://github.com/ProjectImplicit/PIquest/commit/61ae7a3026b4b5bdb603c3d095e0578efad0044a))
  * slider support for label css ([39e57335](https://github.com/ProjectImplicit/PIquest/commit/39e573350c8945f02f59c792a5234f1b8beb35bb))


<a name="0.0.46"></a>
### 0.0.46 (2015-05-22)


#### Bug Fixes

* **IE:**
  * fixed IE8 problem with grid template ([97b32eff](https://github.com/ProjectImplicit/PIquest/commit/97b32eff59c1954d187300cf29122c17f518d02c))
  * make sure console is available ([63b3fdfa](https://github.com/ProjectImplicit/PIquest/commit/63b3fdfa7184dd0e14d5dfadfedfde6dad410461))
* **bootstrap:** fixed race condition between domready and jqlite.ready that caused problems with ([48816d68](https://github.com/ProjectImplicit/PIquest/commit/48816d681f380b0596372dd1447a253ab47a1591))
* **questDirectives:**
  * in grid, when assigning default values ignore type=text columns ([80011ffb](https://github.com/ProjectImplicit/PIquest/commit/80011ffba1e2ae4dfc27fd361a90633f4380efb6))
  * slider edges behave correctly ([5c573916](https://github.com/ProjectImplicit/PIquest/commit/5c573916037ef4a09c97c76aade478d04fded2d2))
* **safari:** fixed unexplained problem on IOS8. https://github.com/angular/angular.js/issues/ ([a112a092](https://github.com/ProjectImplicit/PIquest/commit/a112a09236847242d1d163278950a6f452d50e7d))


#### Features

* **questDirectives:**
  * several grid features ([52d81fa1](https://github.com/ProjectImplicit/PIquest/commit/52d81fa15d5537ea2490a2c44c7a38070d228ca4))
  * allow control of grid css. ([06c240a2](https://github.com/ProjectImplicit/PIquest/commit/06c240a22da8bf3d10eca92d60f00c8135dec31a), closes [#106](https://github.com/ProjectImplicit/PIquest/issues/106))


<a name"0.0.45"></a>
### 0.0.45 (2015-05-21)


#### Bug Fixes

* **questDirectives:** slider edges behave correctly ([5c573916](https://github.com/ProjectImplicit/PIquest/commit/5c573916))


#### Features

* **questDirectives:**
  * several grid features ([52d81fa1](https://github.com/ProjectImplicit/PIquest/commit/52d81fa1))
  * allow control of grid css. ([06c240a2](https://github.com/ProjectImplicit/PIquest/commit/06c240a2), closes [#106](https://github.com/ProjectImplicit/PIquest/issues/106))


<a name="0.0.44"></a>
### 0.0.44 (2015-05-15)


#### Bug Fixes

* **questDirectives:** reverse now works correctly.. Closes #104 ([bb00ed92](https://github.com/ProjectImplicit/PIquest/commit/bb00ed926421ce3e10ec7cbb3d321a24c69a76d5), closes [#107](https://github.com/ProjectImplicit/PIquest/issues/107))


#### Features

* **database:** deep templating where needed. ([00e18758](https://github.com/ProjectImplicit/PIquest/commit/00e1875817fec929df88b5ddad7f46f6e94127e3), closes [#99](https://github.com/ProjectImplicit/PIquest/issues/99))
* **questDirectives:**
  * support slider hidePips, displayValue and fix pointer ([bcac0d8b](https://github.com/ProjectImplicit/PIquest/commit/bcac0d8b0c4ebe89dc5a06b0f45190fb79b2bda5))
  * grid required. ([56d1c12e](https://github.com/ProjectImplicit/PIquest/commit/56d1c12ef476b7e0ca1fbf5b3cde88d3cf528797), closes [#104](https://github.com/ProjectImplicit/PIquest/issues/104))


<a name="0.0.43"></a>
### 0.0.43 (2015-05-13)


#### Bug Fixes

* **questDirectives:**
  * slider click accuracy fix ([46f8dd6d](https://github.com/ProjectImplicit/PIquest/commit/46f8dd6dddc6d12f935706218b447d9f822b8864))
  * minor grid fixes ([25194b6e](https://github.com/ProjectImplicit/PIquest/commit/25194b6e69833630f5fed35318c21e7006c2d115))


#### Features

* **questDirectives:** added a general option to set maxWidth to questions ([2ce1355a](https://github.com/ProjectImplicit/PIquest/commit/2ce1355a710695a89f1101f2769fb070d4eb970a))


<a name="0.0.42"></a>
### 0.0.42 (2015-05-13)


#### Bug Fixes

* **questDirectives:** minlength should be minLength. ([07f5c001](https://github.com/ProjectImplicit/PIquest/commit/07f5c001cee45e44c5f2d233a55a51607ec51907), closes [#96](https://github.com/ProjectImplicit/PIquest/issues/96))


#### Features

* **questDirectives:**
  * support grid type questions. ([4cd6cc84](https://github.com/ProjectImplicit/PIquest/commit/4cd6cc8437a71223f6c976319289b2c60715bebd), closes [#97](https://github.com/ProjectImplicit/PIquest/issues/97))
  * support stemCss. ([f7e99b02](https://github.com/ProjectImplicit/PIquest/commit/f7e99b0249e640b8b3183d390290d0d40080b967), closes [#98](https://github.com/ProjectImplicit/PIquest/issues/98))
  * slider ready for use. ([146b9828](https://github.com/ProjectImplicit/PIquest/commit/146b98287e2c477e524cbb2dc12907d037da4fde), closes [#26](https://github.com/ProjectImplicit/PIquest/issues/26))


<a name="0.0.41"></a>
### 0.0.41 (2015-04-30)


#### Bug Fixes

* **manager:** current object should be set into piGlobal[task.name] ([96b8c775](https://github.com/ProjectImplicit/PIquest/commit/96b8c7751e85b6d0aabc31eb5d358aef562f7126))


#### Features

* **preloader:** create preloader and implement imagePreload for manager. ([02aef089](https://github.com/ProjectImplicit/PIquest/commit/02aef0899aa54ac5f27622973436725724ac3074), closes [#79](https://github.com/ProjectImplicit/PIquest/issues/79))
* **questController:** add event hooks to questions. ([d960074b](https://github.com/ProjectImplicit/PIquest/commit/d960074b30dc222f52f7227fc0800885d1cc6858), closes [#64](https://github.com/ProjectImplicit/PIquest/issues/64))
* **questDirectives:**
  * support preliminary slider ([735e50af](https://github.com/ProjectImplicit/PIquest/commit/735e50afecf73897e4dc55207015943ef26024c1))
  * support question description ([0cbdc895](https://github.com/ProjectImplicit/PIquest/commit/0cbdc895407e3413c1f34a9eaa530d8ee569e841))


<a name="0.0.40"></a>
### 0.0.40 (2015-04-19)


#### Bug Fixes

* **questDirectives:** support for width on IE ([22f2812d](https://github.com/ProjectImplicit/PIquest/commit/22f2812d718b6d9e0c33b10827b105b176892437))


<a name="0.0.39"></a>
### 0.0.39 (2015-04-19)


#### Bug Fixes

* **manager:** force scripts to reload when skip=true ([680c24ba](https://github.com/ProjectImplicit/PIquest/commit/680c24babb258801b551d72e5ae8f7039b400e58))
* **pipAPI:** support getLogs ([b8e497da](https://github.com/ProjectImplicit/PIquest/commit/b8e497daeb248719e6aa53c682fdfabce705014a))
* **style:** removed .container padding ([da8a40d4](https://github.com/ProjectImplicit/PIquest/commit/da8a40d4eaeee555f053069be740f03defd59154))


#### Features

* **questDirectives:**
  * support width for text and textNumber ([e89a1e17](https://github.com/ProjectImplicit/PIquest/commit/e89a1e17ca1d01f677ece5fdfeb2d760a8714805))
  * dfltUnits filter ([8359fc72](https://github.com/ProjectImplicit/PIquest/commit/8359fc72e53d0d3b2df3e9df22d8f5f3bdf9471d))
  * support textarea question. ([fd055e54](https://github.com/ProjectImplicit/PIquest/commit/fd055e540a3e6c78cce7a23803f2e6d01bd1d581), closes [#95](https://github.com/ProjectImplicit/PIquest/issues/95))
  * questText supports maxlengthLimit. ([13d6fb2f](https://github.com/ProjectImplicit/PIquest/commit/13d6fb2f103adca4ce6f9093daebdde6389ef1c4), closes [#71](https://github.com/ProjectImplicit/PIquest/issues/71))


<a name="0.0.38"></a>
### 0.0.38 (2015-04-14)


#### Bug Fixes

* **PI:** debrief next URL is now implicit/Assign ([73f9c687](https://github.com/ProjectImplicit/PIquest/commit/73f9c68780f00acb70b7c5fa2fbb2cffce49e945))
* **manager:** setup global.current correctly ([7b6751d9](https://github.com/ProjectImplicit/PIquest/commit/7b6751d96f925166a76d0dfa7cabf38e45c17296))


<a name="0.0.37"></a>
### 0.0.37 (2015-04-02)


#### Features

* **timer:**
  * support displaying message at end of timer ([89fdb6b0](https://github.com/ProjectImplicit/PIquest/commit/89fdb6b084e4f55f0c039343bdb92d952944663f))
  * timer directive ([5894b397](https://github.com/ProjectImplicit/PIquest/commit/5894b39710fbbb4806dd4439e3680706f2acc6de))


<a name="0.0.36"></a>
### 0.0.36 (2015-03-31)


#### Bug Fixes

* **PI:** updates to the debrief template ([e96744fd](https://github.com/ProjectImplicit/PIquest/commit/e96744fd91ce3c9e98a8a7004c71c6d8762169ed))


#### Features

* **questDirectives:** text input in the same line as the stem. ([0058e136](https://github.com/ProjectImplicit/PIquest/commit/0058e136d5815f8a08a81a258cba6d95932cb838), closes [#72](https://github.com/ProjectImplicit/PIquest/issues/72))


<a name="0.0.35"></a>
### 0.0.35 (2015-03-29)


#### Bug Fixes

* **mixer:** random now mixes the sequence before randomizing ([0b436687](https://github.com/ProjectImplicit/PIquest/commit/0b4366876392c4e4f1f64bbec02f381e4061e6f4))


<a name="0.0.21"></a>
### 0.0.21 (2014-12-07)


#### Bug Fixes

* **docs:** fix inherit by functions docs ([7ce0b691](https://github.com/ProjectImplicit/PIquest/commit/7ce0b691aa4658ea03db0c349d1c8c4afb0608b4))
* **manager:** made getScript fetch absolute paths better. still have a problem with relative p ([567724ca](https://github.com/ProjectImplicit/PIquest/commit/567724ca21a4051d7abc5ade72416dca2c97ef01))
* **questController:** does not init questions that have a base object in global.current. ([6281aaff](https://github.com/ProjectImplicit/PIquest/commit/6281aaffde79be455f21f4c47f77038b830cd6c0), closes [#60](https://github.com/ProjectImplicit/PIquest/issues/60))
* **selectOne:** when unselecting a button the activation does not go away. ([c731f177](https://github.com/ProjectImplicit/PIquest/commit/c731f177953a532fc471da9a9d3db75d5a5e5046), closes [#61](https://github.com/ProjectImplicit/PIquest/issues/61))


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
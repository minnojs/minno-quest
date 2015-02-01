// Browsers to run on Sauce Labs

// For more browsers on Sauce Labs see:
// https://saucelabs.com/docs/platforms/webdriver
// Check out "https://saucelabs.com/platforms" for all browser/OS combos

module.exports = {
	sl_chrome: {
		base: 'SauceLabs',
		browserName: 'chrome',
		platform: 'Windows 7'
	},
	sl_firefox: {
		base: 'SauceLabs',
		browserName: 'firefox',
		version: '35'
	},
	sl_ie_11: {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		platform: 'Windows 8.1',
		version: '11'
	},
	sl_ie_8: {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		platform: 'Windows XP',
		version: '8'
	},
    SL_Safari: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.9',
      version: '7'
    }
};
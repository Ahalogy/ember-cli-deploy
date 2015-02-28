var UnsupportedCommand = require('./unsupported-command');

module.exports = UnsupportedCommand({
  name: 'deploy:assets',
  description: 'Deploys assets to an asset-host (default: aws:s3)',
  works: 'insideProject',

  availableOptions: [
    { name: 'environment', type: String, default: 'development', aliases: ['e',{'dev' : 'development'}, {'prod' : 'production'}] },
    { name: 'deploy-config-file', type: String, default: 'deploy.json' }
  ],

  run: function(commandOptions, rawArgs) {
    var AssetsTask = require('../tasks/assets');
    var assetsTask = new AssetsTask({
      ui: this.ui,
      analytics: this.analytics,
      project: this.project
    });

    return assetsTask.run(commandOptions);
  }
});

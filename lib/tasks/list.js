var chalk               = require('chalk');
var Task                = require('ember-cli/lib/models/task');
var ConfigurationReader = require('../../utilities/configuration-reader');
var RSVP                = require('rsvp');

module.exports = Task.extend({
  run: function(options) {
    var Deploy = require('deployinator');
    var ui     = this.ui;
    var config = new ConfigurationReader({
      environment: options.environment
    });

    var deploy = new Deploy({
      storeConfig: config.store,
      manifest: this.project.name(),
      manifestSize: 10
    });

    var promises = {
      uploads: deploy.listUploads(),
      current: deploy.getCurrent()
    };

    return RSVP.hash(promises)
      .then(function(results) {
        var revisions = results.uploads;
        var current   = results.current;
        var size      = deploy.manifestSize;

        ui.writeLine(this.createRevisionsLog(size, revisions, current));
      }.bind(this));
  },

  createRevisionsLog: function(manifestSize, revisions, currentRevision) {
    var headline      = '\nLast '+ manifestSize + ' uploaded revisions:\n\n';
    var revisionsList = revisions.reduce(function(prev, curr) {
      var prefix = (curr === currentRevision) ? '| => ' : '|    ';
      return prev + prefix + chalk.green(curr) + '\n';
    }, '');
    var footer = '\n\n# => - current revision';

    return headline + revisionsList + footer;
  },
});

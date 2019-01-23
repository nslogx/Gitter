var hljs = require('./highlight');

hljs.registerLanguage('bash', require('./languages/bash'));
hljs.registerLanguage('coffeescript', require('./languages/coffeescript'));
hljs.registerLanguage('css', require('./languages/css'));
hljs.registerLanguage('dns', require('./languages/dns'));
hljs.registerLanguage('dos', require('./languages/dos'));
hljs.registerLanguage('erlang', require('./languages/erlang'));
hljs.registerLanguage('go', require('./languages/go'));
hljs.registerLanguage('htmlbars', require('./languages/htmlbars'));
hljs.registerLanguage('http', require('./languages/http'));
hljs.registerLanguage('java', require('./languages/java'));
hljs.registerLanguage('javascript', require('./languages/javascript'));
hljs.registerLanguage('json', require('./languages/json'));
hljs.registerLanguage('less', require('./languages/less'));
hljs.registerLanguage('makefile', require('./languages/makefile'));
hljs.registerLanguage('markdown', require('./languages/markdown'));
hljs.registerLanguage('nginx', require('./languages/nginx'));
hljs.registerLanguage('php', require('./languages/php'));
hljs.registerLanguage('powershell', require('./languages/powershell'));
hljs.registerLanguage('python', require('./languages/python'));
hljs.registerLanguage('ruby', require('./languages/ruby'));
hljs.registerLanguage('scss', require('./languages/scss'));
hljs.registerLanguage('shell', require('./languages/shell'));
hljs.registerLanguage('sql', require('./languages/sql'));
hljs.registerLanguage('swift', require('./languages/swift'));
hljs.registerLanguage('typescript', require('./languages/typescript'));

module.exports = hljs;
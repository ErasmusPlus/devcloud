//# sourceMappingURL=init.map
// Generated by CoffeeScript 1.10.0

/*
	Copyright (c) 2014, dev-rke
 */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  codiad.ToDo = (function() {

    /*
    		basic plugin environment initialization
     */
    function ToDo(global, jQuery) {
      this.disableToDo = bind(this.disableToDo, this);
      this.updateToDo = bind(this.updateToDo, this);
      this.initToDoListContainer = bind(this.initToDoListContainer, this);
      this.init = bind(this.init, this);
      this.codiad = global.codiad;
      this.amplify = global.amplify;
      this.jQuery = jQuery;
      this.scripts = document.getElementsByTagName('script');
      this.path = this.scripts[this.scripts.length - 1].src.split('?')[0];
      this.curpath = this.path.split('/').slice(0, -1).join('/') + '/';
      this.jQuery((function(_this) {
        return function() {
          return _this.init();
        };
      })(this));
    }


    /*
    		main plugin initialization
     */

    ToDo.prototype.init = function() {
      return this.initToDoListContainer();
    };


    /*
    		init button and menu on bottom menu
    		and append handler
     */

    ToDo.prototype.initToDoListContainer = function() {
      var todoButton, todoMenu;
      todoButton = '<div class="divider"></div>\n<a id="todoButton">\n	<span class="icon-check"></span>TODO\n</a>';
      todoMenu = '<ul id="todoMenu" class="options-menu"></ul>';
      this.jQuery('#editor-bottom-bar').append(todoButton);
      this.$todoButton = this.jQuery('#todoButton');
      this.$todoMenu = this.jQuery(todoMenu);
      this.codiad.editor.initMenuHandler(this.$todoButton, this.$todoMenu);
      this.$todoMenu.on('click', 'li a', (function(_this) {
        return function(element) {
          var line;
          line = _this.jQuery(element.currentTarget).data('line');
          if (line) {
            _this.codiad.active.gotoLine(line);
            return _this.codiad.editor.focus();
          }
        };
      })(this));
      this.amplify.subscribe('active.onFocus', (function(_this) {
        return function() {
          return _this.updateToDo();
        };
      })(this));
      this.updateInterval = null;
      this.amplify.subscribe('active.onOpen', (function(_this) {
        return function() {
          var activeInstance;
          _this.updateToDo();
          activeInstance = _this.codiad.editor.getActive();
          if (!activeInstance) {
            return;
          }
          return activeInstance.getSession().on('change', function(e) {
            clearTimeout(_this.updateInterval);
            return _this.updateInterval = setTimeout(_this.updateToDo, 1000);
          });
        };
      })(this));
      return this.amplify.subscribe('active.onClose', (function(_this) {
        return function() {
          return _this.disableToDo();
        };
      })(this));
    };


    /*
    		update todo button and menu
     */

    ToDo.prototype.updateToDo = function() {
      var content, editorInstance, editorToDo, i, index, len, line, loc, matches, session;
      editorInstance = this.codiad.editor.getActive();
      if (!editorInstance) {
        return;
      }
      content = this.codiad.editor.getContent();
      loc = content.split(/\r?\n/);
      matches = [];
      editorToDo = [];
      for (index = i = 0, len = loc.length; i < len; index = ++i) {
        line = loc[index];
        if (line.indexOf("TODO") > -1 && line.match(/TODO\s*:(.*)/)) {
          matches.push('<li><a data-line="' + (index + 1) + '">' + line.match(/TODO\s*:(.*)/)[1] + '</a></li>');
          editorToDo.push({
            row: index,
            column: 1,
            text: line.match(/(TODO\s*:.*)/)[1],
            type: "info"
          });
        }
      }
      if (matches.length > 0) {
        this.$todoMenu.empty().append($(matches.join("")));
        session = editorInstance.getSession();
        session.setAnnotations(editorToDo.concat(session.getAnnotations()));
        return this.$todoButton.find('span').removeClass('icon-check').addClass('icon-clipboard');
      } else {
        return this.disableToDo();
      }
    };


    /*
    		disable ToDoList
     */

    ToDo.prototype.disableToDo = function() {
      this.$todoMenu.empty().append("<li><a>Nothing to do</a></li>");
      return this.$todoButton.find('span').removeClass('icon-clipboard').addClass('icon-check');
    };

    return ToDo;

  })();

  new codiad.ToDo(this, jQuery);

}).call(this);
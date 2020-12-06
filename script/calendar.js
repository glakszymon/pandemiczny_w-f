var app = new Vue({
  el: '#app',
  data: {
    mode: "kalendarz",
    currentday: null,
    slide_file: null
  },
  methods: {
    init: function() {
        var today = new Date();
        this.currentday = today.getDate();
    },
  
    show_slide: function(number) {
      this.slide_file = "data/kalendarz_sportu/slide"+number+".jpg";
      this.mode = 'slide';
    },

    reset: function() {
      this.mode = 'kalendarz';
    }

  }
})

app.init();
var app = new Vue({
  el: '#app',
  data: {
    currentday: null
  },
  methods: {
    init: function() {
        var today = new Date();
        this.currentday = today.getDate();
    }
  }
})

app.init();
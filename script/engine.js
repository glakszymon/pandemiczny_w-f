var app = new Vue({
  el: '#app',
  data: {
    exerciseList: []
  },
  methods: {
    init: function() {
        this.laduj_liste();
    },

  
    laduj_liste: function () {
      axios.get('data/list.json')
      .then(function (response) {
        app.exerciseList = response.data;
        console.log(app.exerciseList);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
})


app.init();
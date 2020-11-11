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
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    opis_cwiczenia: function (exercise){
      axios.get('exercise/'+ exercise.file)
      .then(function (response) {
        // app.exerciseList = response.data;
        console.log(response.data);
        var converter = new showdown.Converter(),
        html = converter.makeHtml(response.data);
        document.getElementById('content').innerHTML = html;
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
})



app.init();
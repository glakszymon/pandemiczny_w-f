var app = new Vue({
  el: '#app',
  data: {
    exerciseList: [],
    current: null
  },
  methods: {
    init: function() {
        this.laduj_liste();
    },

  
    laduj_liste: function () {
      axios.get('data/list.json')
      .then(function (response) {
        lista = response.data;
        lista.sort(function(a,b){
            if (a.name < b.name)
              return -1;
            if (a.name > b.name)
              return 1;
            return 0;
        });
        app.exerciseList = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    opis_cwiczenia: function (exercise){
      axios.get('exercise/'+ exercise.file)
      .then(function (response) {
        var converter = new showdown.Converter(),
        html = converter.makeHtml(response.data);
        document.getElementById('content').innerHTML = html;
      
        this.carrent = exercise.file
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
})



app.init();
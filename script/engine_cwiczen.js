var app = new Vue({
  el: '#app',
  data: {
    exerciseList: [],
    full_list: [],
    currentFile: null,
    czas: 20
  },
  methods: {
    init: function() {
        this.laduj_liste();
    },
    losuj: function() {
      var serie = Math.ceil(this.czas/10);
      var czas_serii = Math.floor(this.czas*60/serie);
      let time_left = czas_serii;
      var backup = this.exercise;
      while(time_left > 0){
        console.warn("losuję...");
        var los = Math.floor(Math.random() * this.full_list.length);
        console.warn(los);
        this.exerciseList.push(this.full_list[los]);
        console.warn("test1");
        console.warn(this.full_list[los]);
        time_left -= this.full_list[los].time;
        time_left -= 15; // przerwa
        delete this.full_list[los];
        this.full_list = this.full_list.filter(x => x != undefined);
        console.warn("time");
        console.warn(time_left);
      this.exercise = backup
      }
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
        app.full_list = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    opis_cwiczenia: function (exercise){
      //console.log(exercise);
      let currentExercise = exercise;
      axios.get('exercise/'+ exercise.file)
      .then(function (response) {
        var converter = new showdown.Converter(),
        html = converter.makeHtml(response.data);
        document.getElementById('content').innerHTML = html;
      
        app.currentFile = currentExercise.file;
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
})



app.init();
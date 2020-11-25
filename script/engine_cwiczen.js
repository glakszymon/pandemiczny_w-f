var app = new Vue({
  el: '#app',
  data: {
    exerciseList: [],
    full_list: [],
    currentFile: null,
    czas: 20,
    mode: '',

    aktualnaseria: 0,
    iloscserii: 0,
    aktualnecwiczenie: 0,
    ilosccwiczen: 0,
    reszta_czasu_cwiczenia: 0,
    nazwa_cwiczenia_teraz: '',
    aktualne_cwiczenie_obrazek: '',
    seria: 0

  },
  methods: {
    init: function() {
        this.laduj_liste();
    },
    losuj: function() {
      this.mode = '';
      var serie = Math.ceil(this.czas/10);
      var czas_serii = Math.floor(this.czas*60/serie);
      let time_left = czas_serii;
      const backup = [...this.full_list];
      this.exerciseList = []
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
      }
      this.full_list = backup;
      if (this.exerciseList.length>0) {
        this.mode = 'polosowaniu';
        this.iloscserii = serie;
      }
      
    },

    start_cwiczen: function() {
      this.mode = 'go';
      this.ilosccwiczen = this.exerciseList.length;
      this.aktualnaseria = 1;
      this.aktualnecwiczenie = 0;
      this.gonext();
    },

    gonext: function() {
      this.aktualnecwiczenie ++;
      if (this.aktualnecwiczenie > this.ilosccwiczen) {
        this.aktualnaseria ++;
        this.aktualnecwiczenie = 1;
      }
      if (this.aktualnaseria > this.iloscserii) {
        this.finish();
        return;
      }
      this.nazwa_cwiczenia_teraz = this.exerciseList[this.aktualnecwiczenie - 1].name;
      this.aktualne_cwiczenie_obrazek = this.exerciseList[this.aktualnecwiczenie - 1].name;
      this.reszta_czasu_cwiczenia = this.exerciseList[this.aktualnecwiczenie - 1].time;
      window.setTimeout(this.count_down, 1000);

    },

    finish: function() {

    },

    count_down: function() {
      this.reszta_czasu_cwiczenia--;
      if (this.reszta_czasu_cwiczenia <= 0) {
        this.gonext();
        return;
      }
      window.setTimeout(this.count_down, 1000);
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
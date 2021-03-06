var app = new Vue({
  el: '#app',
  data: {
    exerciseList: [],
    full_list: [],
    currentFile: null,
    czas: 20,
    mode: '',

    his: {
      data: null, 
      czas_trwania: null,
      serie: null,
      cwiczenia: []
    },

    aktualnaseria: 0,
    iloscserii: 0,
    aktualnecwiczenie: 0,
    ilosccwiczen: 0,
    reszta_czasu_cwiczenia: 0,
    nazwa_cwiczenia_teraz: '',
    aktualne_cwiczenie_obrazek: '',
    seria: 0,
    kolejne_cwiczenie: null,
    timeout_action: null,
    nastepne_cwiczenie_obrazek: null

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
      this.exerciseList = [];
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
      this.his.data = new Date ();
      this.his.serie = this.iloscserii;
      this.mode = 'go';
      this.ilosccwiczen = this.exerciseList.length;
      this.aktualnaseria = 1;
      this.aktualnecwiczenie = 0;
      this.gonext();
    },
    
    gonext: function() {
      if (this.aktualnaseria == 1 && this.aktualnecwiczenie > 0) {
        var cokolwiek = {
          "znacznik": this.exerciseList[this.aktualnecwiczenie - 1].znacznik,
          "czas": this.exerciseList[this.aktualnecwiczenie - 1].time

        }
        this.his.cwiczenia.push(cokolwiek);
      }
      this.aktualnecwiczenie ++;
      let zmiana_serii = false;
      if (this.aktualnecwiczenie > this.ilosccwiczen) {
        this.aktualnaseria ++;
        this.aktualnecwiczenie = 1;
        zmiana_serii = true;
      }
      if (this.aktualnaseria > this.iloscserii) {
        this.his.czas = (new Date () - this.his.data)/1000;
        this.finish();
        return;
      }
      this.wait_please(zmiana_serii);
    },
        
    show_current: function() {
      
      this.nastepne_cwiczenie_obrazek = null;
      this.kolejne_cwiczenie = null;
      this.nazwa_cwiczenia_teraz = this.exerciseList[this.aktualnecwiczenie - 1].name;
      this.aktualne_cwiczenie_obrazek = "exercise/" + this.exerciseList[this.aktualnecwiczenie - 1].photo;
      this.reszta_czasu_cwiczenia = this.exerciseList[this.aktualnecwiczenie - 1].time;
      this.timeout_action = 'go next';
      window.setTimeout(this.count_down, 1000);
      
    },
    
    finish: function() {
      this.nazwa_cwiczenia_teraz = "To juz jest koniec nie ma już nic";
      this.mode = 'finish';
      this.save();
    },

    save: function(){
      if (!window.indexedDB) {
        console.log(`Your browser doesn't support IndexedDB`);
        return;
      }
      const request = indexedDB.open('PandemicznyWF', 1);
      request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
      };
    
      request.onsuccess = (event) => {
          let db = request.result;
          const txn = db.transaction('Historia', 'readwrite');
      
          const store = txn.objectStore('Historia');
                 
          let query = store.put(app.his);
      
          query.onsuccess = function (event) {
              console.log(event);
          };

          query.onerror = function (event) {
              console.log(event.target.errorCode);
          }
      
          txn.oncomplete = function () {
              db.close();
          };
      }

      request.onupgradeneeded = (event) => {
        let db = event.target.result;

        let store = db.createObjectStore('Historia', {
            keyPath: 'data'
        });
      };
    },
    
    count_down: function() {
      this.reszta_czasu_cwiczenia--;
      if (this.reszta_czasu_cwiczenia <= 0) {
        switch (this.timeout_action) {
          case 'go next':
            this.gonext();
            break;
            case 'show current':
              this.show_current();
              break;
            }
            return;
          }
          window.setTimeout(this.count_down, 1000);
        },
        
        wait_please: function(zmiana_serii) {
          this.nazwa_cwiczenia_teraz = "Złap oddech";
          this.aktualne_cwiczenie_obrazek = "data/past.jpg";
          this.kolejne_cwiczenie = this.exerciseList[this.aktualnecwiczenie - 1].name;
          this.nastepne_cwiczenie_obrazek = "exercise/" + this.exerciseList[this.aktualnecwiczenie - 1].photo;
          if (zmiana_serii == true) {
            this.reszta_czasu_cwiczenia = 30;
          }
          else {
            this.reszta_czasu_cwiczenia = 15;
          }
      this.timeout_action = 'show current';
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
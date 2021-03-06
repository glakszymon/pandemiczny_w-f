var app = new Vue({
  el: '#app',
  data: {
    saves: [],
    current_save: null,
    full_list: [],

    exerciseList: [],
    currentFile: null,
    czas: 20,
    mode: '',

    his: {
      data: null, 
      czas_trwania: null,
      serie: null,
      cwiczenia: []
    },
  },
  filters: {
    formatujDate: function(data){
      return data.toLocaleDateString() + " " + data.toLocaleTimeString();
    },
    podaj_nazwe: function(znacznik){
      var y = app.full_list.find((x) => {return x.znacznik == znacznik});
      return y.name
    },
  },

  methods: {
    init: function() {
        this.laduj_liste();
        this.load();
    },

    show_details: function(index){
      this.current_save = this.saves[index];
    },

    load: function(){
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
          
          store.openCursor().onsuccess = (event) => {
            let cursor = event.target.result;
            if (cursor) {
              let save = cursor.value;
              app.saves.push(save);
              cursor.continue();
            }
          }
      
          txn.oncomplete = function () {
              db.close();
          };
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
    }
    
  }
})



app.init();
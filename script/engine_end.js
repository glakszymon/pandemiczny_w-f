var app = new Vue({
  el: '#app',
  data: {
    saves: [],

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
  },
  filters: {
    formatujDate: function(data){
      console.log(`lololololo`);
      return "szymek";
    },

  },
  methods: {
    init: function() {
        this.laduj_liste();
        this.load();
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
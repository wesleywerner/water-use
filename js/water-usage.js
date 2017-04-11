var blueprint = [
    {
      "name": "Drinks",
      "entries": [
        {
          "title": "cups of coffee",
          "period": 1,
          "litres": 140,
          "options": [
            { 'text': 'Ground/Filter', 'ratio': 1 },
            { 'text': 'Instant', 'ratio': 0.571 }
          ]
        },
        {
          "title": "cups of tea",
          "period": 1,
          "litres": 80
        },
        {
          "title": "Glasses of milk (200ml)",
          "period": 7,
          "litres": 200
        },
        {
          "title": "glasses of orange/apple juice",
          "period": 7,
          "litres": 170
        }
      ]
    }
 ];

var app = new Vue({
  el: '#app',
  data: {
    categories: [],
    allAnswered: false,
    displayFactorOptions: [
      { 
        'text': 'Small 1 litre bottles',
        'value': 1,
        'icon': 'https://openclipart.org/image/32px/svg_to_png/193719/1401026670.png&disposition=attachment'
      },
      { 
        'text': 'Large 5 litre bottles',
        'value': 5,
        'icon': 'https://openclipart.org/image/32px/svg_to_png/4813/jonata-Water-bottle.png&disposition=attachment'
      }
    ],
    displayFactor: null
  },
  methods: {
    
    reset: function() {
      // reset states
      this.allAnswered = false;
      this.displayFactor = this.displayFactorOptions[0];
      // clone blueprint
      var bp = JSON.parse(JSON.stringify(blueprint));
      // add extra attributes
      bp.forEach(function(category, catIndex) {
        category.visible = catIndex == 0;
        category.entries.forEach(function(entry, entryIndex) {
          entry.qty = 0;
          entry.total = 0;
          entry.representativeTotal = 0;
          entry.ratio = entry.ratio || 1;
          entry.visible = (catIndex == 0 && entryIndex == 0);
        });
      });
      this.categories = bp;
    },
    
    calculate: function() {
      // calculate usage for each entry as
      // (qty / period) * (litres * ratio)
      // where  qty is user entered
      //        period is days divisor
      //        ratio adjusts the base litres by user selected option
      var that = this;
      this.categories.forEach(function(category) {
        category.entries.forEach(function(entry) {
          entry.total = Math.round( (entry.qty / entry.period) * (entry.litres * entry.ratio) );
          // the representative total is divided by the display factor value
          entry.representativeTotal = Math.round( entry.total / that.displayFactor.value );
          
        });
      });
    },
    
    next: function() {
      // recalculate usage
      this.calculate();
      // set the next entry visible
      var done = false;
      this.categories.forEach(function(category) {
        if (!done) {
          category.visible = true;
          category.entries.forEach(function(entry) {
            if (!done) {
              if (!entry.visible) {
                done = true;
                entry.visible = true;
                // scroll the entry into view
                setTimeout(function() {
                  var el = document.getElementById('nextButton');
                  if (el) el.scrollIntoView({block: 'end', behavior: 'smooth'});
                },1000);
              }
            }
          });
        }
      });
      
      // scroll to the results section
      setTimeout(function() {
        var el = document.getElementById('results');
        if (el) el.scrollIntoView({block: 'start', behavior: 'smooth'});
      },1000);

      // all entries are now visible (none were marked as done)
      this.allAnswered = !done;
    },
    
    scrollToContent: function() {
      var el = document.getElementById('app');
      if (el) el.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
    
  },
  
  watch: {
    displayFactor: function() {
      this.calculate();
    }
  },
  
  computed: {
    
  }
});

app.reset();

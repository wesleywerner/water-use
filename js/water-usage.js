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
    displayFactor: 1
  },
  methods: {
    
    reset: function() {
      // reset states
      this.allAnswered = false;
      // clone blueprint
      var bp = JSON.parse(JSON.stringify(blueprint));
      // add extra attributes
      bp.forEach(function(category, catIndex) {
        category.visible = catIndex == 0;
        category.entries.forEach(function(entry, entryIndex) {
          entry.qty = 0;
          entry.total = 0;
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
      this.categories.forEach(function(category) {
        category.entries.forEach(function(entry) {
          entry.total = Math.round( (entry.qty / entry.period) * (entry.litres * entry.ratio) );
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
              }
            }
          });
        }
      });
      // all entries are now visible (none were marked as done)
      this.allAnswered = !done;
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

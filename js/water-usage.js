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
    categories: []
  },
  methods: {
    
    reset: function() {
      // clone blueprint
      var bp = JSON.parse(JSON.stringify(blueprint));
      // add extra attributes
      bp.forEach(function(category, catIndex) {
        category.entries.forEach(function(entry, entryIndex) {
          entry.qty = 0;
          entry.total = 0;
          entry.ratio = entry.ratio || 1;
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
    }
    
  },
  
  watch: {

  },
  
  computed: {
    
  }
});

app.reset();

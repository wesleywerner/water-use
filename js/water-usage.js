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
        },
        {
          "title": "Glasses of beer (250ml)",
          "period": 7,
          "litres": 74
        },
        {
          "title": "Glasses of wine (250ml)",
          "period": 7,
          "litres": 109
        }
      ]
    },
    {
      "name": "Food",
      "entries": [
        {
          "title": "slices of bread",
          "period": 7,
          "litres": 135
        },
        {
          "title": "potatoes",
          "period": 7,
          "litres": 25,
          "options": [
            { 'text': 'Small (100g)', 'ratio': 1 },
            { 'text': 'Medium (140-225g)', 'ratio': 1.5 },
            { 'text': 'Large (225-340g)', 'ratio': 2.5 }
          ]
        },
        {
          "title": "Bananas (120g)",
          "period": 7,
          "litres": 94.8
        },
        {
          "title": "Cheese portions",
          "period": 7,
          "litres": 318,
          "options": [
            { 'text': 'Fistful (60g)', 'ratio': 0.6 },
            { 'text': 'Half a cup (100g)', 'ratio': 1 },
            { 'text': 'Full cup (200g)', 'ratio': 2 }
          ]
        },
        {
          "title": "Chocolate",
          "period": 7,
          "litres": 1719,
          "options": [
            { "text": "Tiny serving (20g, a couple pieces)", "ratio": 0.2 },
            { "text": "Medium serving (50g, half a slab)", "ratio": 0.5 },
            { "text": "Large serving (100g, a slab of Lindt)", "ratio": 1 },
            { "text": "Huge serving (200g)", "ratio": 2 }
          ]
        },
        {
          "title": "Pizza",
          "period": 7,
          "litres": 1239
        },
        {
          "title": "Pasta",
          "period": 7,
          "litres": 185,
          "options": [
            { "text": "Normal serving (100g)", "ratio": 1 },
            { "text": "Smaller serving (60g)", "ratio": 0.6 },
            { "text": "Larger serving (130g)", "ratio": 1.3 }
          ]
        },
        {
          "title": "Rice",
          "period": 7,
          "litres": 245,
          "options": [
            { "text": "Normal serving (100g)", "ratio": 1 },
            { "text": "Smaller serving (60g)", "ratio": 0.6 },
            { "text": "Larger serving (130g)", "ratio": 1.3 }
          ]
        },
        {
          "title": "Chicken",
          "period": 7,
          "litres": 432,
          "options": [
            { "text": "Normal serving (100g)", "ratio": 1 },
            { "text": "Smaller serving (60g)", "ratio": 0.6 },
            { "text": "Larger serving (170g)", "ratio": 1.7 }
          ]
        },
        {
          "title": "Pork",
          "period": 7,
          "litres": 598,
          "options": [
            { "text": "Normal serving (100g)", "ratio": 1 },
            { "text": "Smaller serving (60g)", "ratio": 0.6 },
            { "text": "Larger serving (170g)", "ratio": 1.7 }
          ]
        },
        {
          "title": "Mutton",
          "period": 7,
          "litres": 1041,
          "options": [
            { "text": "Normal serving (100g)", "ratio": 1 },
            { "text": "Smaller serving (60g)", "ratio": 0.6 },
            { "text": "Larger serving (170g)", "ratio": 1.7 }
          ]
        },
        {
          "title": "Beef",
          "period": 7,
          "litres": 1541,
          "options": [
            { "text": "Normal serving (100g)", "ratio": 1 },
            { "text": "Smaller serving (60g)", "ratio": 0.6 },
            { "text": "Larger serving (170g)", "ratio": 1.7 }
          ]
        }
      ]
    },
    {
      "name": "Outside",
      "entries": [
        {
          "title": "minutes water the garden",
          "period": 7,
          "litres": 5,
          "options": [
            { 'text': 'Small Garden', 'ratio': 0.5 },
            { 'text': 'Medium Garden', 'ratio': 1 },
            { 'text': 'Large Garden', 'ratio': 2 }
          ]
        }
      ]
    }
 ];

var app = new Vue({
  el: '#app',
  data: {
    categories: [],
    allAnswered: false,
    grandTotal: 0,
    displayFactorOptions: [
      { 
        'text': '1 litre bottles',
        'value': 1,
        'icon': 'https://openclipart.org/image/32px/svg_to_png/193719/1401026670.png&disposition=attachment'
      },
      { 
        'text': '5 litre bottles',
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
      this.grandTotal = 0;
      var that = this;
      this.categories.forEach(function(category) {
        category.entries.forEach(function(entry) {
          if (entry.qty > 0) {
            entry.total = Math.round( (entry.qty / entry.period) * (entry.litres * entry.ratio) );
            // the representative total is divided by the display factor value
            entry.representativeTotal = Math.round( entry.total / that.displayFactor.value );
            that.grandTotal += entry.total;
          }
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
                //setTimeout(function() {
                //  var el = document.getElementById('nextButton');
                //  if (el) el.scrollIntoView({block: 'end', behavior: 'smooth'});
                //},1000);
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

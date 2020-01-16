var full_data = []
var new_data = []
var part_data = []
var agg_data = []
var columns = ['name', 'continent', 'gdp', 'life_expectancy', 'population', 'year'];
var filtered_countries = [];
var sort_var = true
var aggr = false
var year = 1995
var sort_by = 'default'
var chart_mode = true
var to_show = 'population'

open_json = function (mode){
    if (mode){
      chart_mode = true
    }
    else{
      chart_mode = false
    }
    d3.json('countries_1995_2012.json', data_loader);
}

data_loader = function(data){
    full_data = data;
    for (i in data){
        var obj = {};
        obj.name = data[i]['name'];
        obj.continent = data[i]['continent'];
        obj.years = [];
        for (j in data[i]['years']){
            var year_data = {};
            year_data.year = data[i]['years'][j]['year'];
            if (data[i]['years'][j]['gdp'] != null){
                year_data.gdp = data[i]['years'][j]['gdp'];
            }
            else{
              year_data.gdp = 0
          }
            year_data.life_expectancy = data[i]['years'][j]['life_expectancy'];
            year_data.population = data[i]['years'][j]['population'];
            obj.years.push(year_data);
        }
        new_data.push(obj);
    }
    // console.log(new_data)
    loader();
}

loader = function(){
        data = data_year(new_data, 1995);
        // console.log('data');
        // console.log(data);
        // chart_ex(data);
        if (chart_mode){
          chart(data)
        }
        else{
          show(data);
        }

    }

data_year = function(data, year){
  var data_y = [];
  for (i in data){
      var obj = {};
      obj.name = data[i]['name'];
      obj.continent = data[i]['continent'];
      obj.year = year;
      for (j in data[i]['years']){
        if (year == data[i]['years'][j]['year']){
          obj.gdp = data[i]['years'][j]['gdp'];
          obj.life_expectancy = data[i]['years'][j]['life_expectancy'];
          obj.population = data[i]['years'][j]['population'];
        }
      }
      data_y.push(obj)
    }

      // console.log("DATA YEAR");
      // console.log(data_y);
      return data_y
}

show = function (data_log){

    // console.log(data_log);
    var table = d3.select('body').append('table');
    var thead = table.append('thead').attr('class', 'thead');
    var tbody = table.append('tbody');

    table.append('caption').html('World Countries Ranking');
    thead.append('tr').selectAll('th').data(columns)
    .enter().append('th').text(function(d){return d;})
    .on("click", function(header, i) {
      sort_by = header
     if (sort_var == true) {
       sort_var = false;
       // console.log("SET TO FALSE")
       tbody.selectAll("tr").sort(function(a, b) {
           return d3.ascending(a[header], b[header]);
         })
       }
     else {
       sort_var = true;
       // console.log("SET TO TRUE")
       tbody.selectAll("tr").sort(function(a, b) {

           return d3.descending(a[header], b[header]);
         }
       )
       }
        style();
     });

        var rows = tbody.selectAll('tr.row')
            .data(data_log)
            .enter()
            .append('tr')
            .attr('class', 'row');

        var cells = rows.selectAll("td")
        .data(function(row) {
            return d3.range(columns.length).map(function(column, i) {
              if (columns[i] == 'year') {
                return row[columns[i]];
              }
              else if (["gdp", "life_expectancy"].includes(columns[i])) {
                return parseFloat(row[columns[i]].toFixed(1)).toLocaleString();
              }
              else {
                return row[columns[i]].toLocaleString();
              }
            });
        })
         .enter()
         .append("td")
         .text(function(d) { return d; });
         style();
}

filter = function(cntry_checkbox){

  if (filtered_countries.includes(cntry_checkbox)){
    index = filtered_countries.indexOf(cntry_checkbox);
    filtered_countries.splice(index, 1)
  }
  else{
    filtered_countries.push(cntry_checkbox)
  }
  // console.log(filtered_countries);

  if (aggr){
    aggregation(year);
    filter_data(agg_data);
    update(part_data)
  }

  else{
    filter_data(data_year(new_data, year));
    update(part_data)
  }
}

filter_data = function(data){
  var new_data_ = [];
  if (filtered_countries.length == 0){
    part_data = data;
  }
  else{
    for (i = 0; i < data.length; i++) {
      obj =  data[i];
      if (filtered_countries.includes(obj.continent)){
        new_data_.push(obj);
      }
    }
    part_data = new_data_;
  }
  // console.log("filter DATA");
  // console.log(part_data);

}

remove = function(){
  d3.select('table').remove()
  d3.select("body").select("svg").remove()
}

update = function(data){
  remove();
  show(data);
  // console.log("sort_by")
  // console.log(sort_by, sort_var)

  if (sort_by != 'default'){
      sorting()
  }
}

style = function(){
    var t = d3.selectAll('tr.row');
    t.style("background-color", function(d, i) {
        if (i % 2){
            return 'white';
        }
        else {
            return 'gray';
        }
    })
  }

aggregation = function(y){
  var agr_list = []
  data_ye = data_year(new_data, y);

  // console.log(data_ye);
  var nested_rows = d3.nest()
  	.key(function(d) { return d.continent; })
    .rollup(function(v) { return {
        count: v.length,
        total_pop: d3.sum(v, function(d) { return d.population; }),
        sum_gdp: d3.sum(v, function(d) { return d.gdp; }),
        avg_life: d3.mean(v, function(d) { return d.life_expectancy; })}})
 	 .entries(data_ye);
  // console.log(nested_rows)
  // console.log(nested_rows[0]['key'])
  for (i in nested_rows){
      var continent = {}
      continent.name = nested_rows[i].key;
      continent.continent = nested_rows[i].key;
      continent.gdp = nested_rows[i].value.sum_gdp;
      continent.life_expectancy = nested_rows[i].value.avg_life;
      continent.population = nested_rows[i].value.total_pop;
      continent.year = y

      if (agr_list.length < 5){
        agr_list.push(continent);
      }}
      agg_data = agr_list
    }
  // console.log(agg_data)

aggregation_trigger = function(condition){
  if (condition){
    aggr = true;
    // console.log("The year is")
    // console.log(year)
    aggregation(year);
    filter_data(agg_data);
    update(part_data)
  }
  else{
    aggr = false;
    filter_data(data_year(new_data, year));
    update(part_data)
  }
}

change_date = function(value){
    year = value;
    // console.log(year);
    data_y = data_year(new_data, year);
    if (chart_mode){
      // remove();
      // chart(data_y);
      update_chart()
    }
    else{
      aggregation(year);
      if (aggr){
        filter_data(agg_data)
      }
      else{
        filter_data(data_y)
      }
      update(part_data)
    }

}

sorting = function(){
  d3.select('body').select('tbody').selectAll("tr").sort(function(a, b) {
      if (sort_var){
          return d3.descending(a[sort_by], b[sort_by]);
      } else{
          return d3.ascending(a[sort_by], b[sort_by]);
      }
  });
  style()

}

chart = function(data){

    var margin = {top: 50, bottom: 10, left:300, right: 40};
    var width = 1200 - margin.left - margin.right;
    var bar_height = 15;
    var height = (bar_height + 5)*data.length - margin.top - margin.bottom + 60;


    // scaling axis
    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleBand().rangeRound([0, height]);
    var max = d3.max(data, function(d) { return d[to_show];} );
    var min = 0;
    xScale.domain([min, max]);
    yScale.domain(data.map(function(d) { return d.name; }));


    var svg = d3.select("body").append("svg")
                .attr("width", width+margin.left+margin.right)
                .attr("height", height+margin.top+margin.bottom);



    // adding labels to SVG
    var labelsGroup = svg.append("g");

    var labels =labelsGroup.selectAll("text").data(data).enter().append('text');

    var labelsAttributes = labels.text(function(d){return d.name;})
                              .attr("y", function(d) { return yScale(d.name) +12;})
                               ;

    // adding bars to SVG
    var barsGroup = svg.append("g");

    var bars = barsGroup.selectAll("rect").data(data).enter().append('rect');

    var barsAttributes = bars.attr("width", function(d) {return xScale(d[to_show])})
                             .attr("height", bar_height)
                             .attr("x", xScale(min))
                             .attr("y", function(d) { return yScale(d.name); })
                             .attr("transform", "translate(160, 0)");


//   .attr('y', function(d, i){return i*11;})
}

set_show = function(v){
  to_show = v;
  update_chart()
}

change_sort = function(v){
  // console.log(sort_by);
  // console.log(v);
  if (sort_by == v){
    if (sort_var == true){
      sort_var = false;
    }
    else{
      sort_var = true
    }
  }
  sort_by = v;
  update_chart()
}

sort_data = function(data){
  if (sort_by != 'default'){
    sorted_y = data.sort(function(a, b) {
        if (sort_var){
            return d3.descending(a[sort_by], b[sort_by]);
        } else{
            return d3.ascending(a[sort_by], b[sort_by]);
        }
    })}
    else{
      sorted_y = data;
    }

  return sorted_y
}

set_filter = function(cntry_checkbox){

  if (filtered_countries.includes(cntry_checkbox)){
    index = filtered_countries.indexOf(cntry_checkbox);
    filtered_countries.splice(index, 1)
  }
  else{
    filtered_countries.push(cntry_checkbox)
  }
  // console.log(filtered_countries)
  update_chart()
}

filter_data_chart = function(data){
  var new_data_ = [];
  if (filtered_countries.length == 0){
    new_data_ = data;
  }
  else{
    for (i = 0; i < data.length; i++) {
      obj =  data[i];
      if (filtered_countries.includes(obj.continent)){
        new_data_.push(obj);
      }
    }}
    return new_data_
  }

update_chart = function(){
  remove();
  // console.log("YEAR:" + year);
  data_y = data_year(new_data, year);
  // console.log("AGGREGATION:" + aggr);
  aggregated_y = aggregate_data(data_y);
  // console.log("AGGREGATION_DATA:");
  // console.log(aggregated_y);
  sorted_y = sort_data(aggregated_y);
  // console.log("SORTED_DATA:");
  // console.log(sorted_y);
  filtered_y = filter_data_chart(sorted_y);
  // console.log("FILTERED_DATA:");
  // console.log(filtered_y);
  chart(filtered_y)
}

aggregate_data = function(data_ye){
  if (aggr){
  var agr_list = []
  // console.log(data_ye);
  var nested_rows = d3.nest()
  	.key(function(d) { return d.continent; })
    .rollup(function(v) { return {
        count: v.length,
        total_pop: d3.sum(v, function(d) { return d.population; }),
        sum_gdp: d3.sum(v, function(d) { return d.gdp; }),
        avg_life: d3.mean(v, function(d) { return d.life_expectancy; })}})
 	 .entries(data_ye);

  for (i in nested_rows){
      var continent = {}
      continent.name = nested_rows[i].key;
      continent.continent = nested_rows[i].key;
      continent.gdp = nested_rows[i].value.sum_gdp;
      continent.life_expectancy = nested_rows[i].value.avg_life;
      continent.population = nested_rows[i].value.total_pop;
      continent.year = year

      if (agr_list.length < 5){
        agr_list.push(continent);
      }
    }
    return agr_list
  }
  else{
    return data_ye
  }
}

set_aggr = function(condition){
  if (condition){
    aggr = true;}
  else{
    aggr = false
  }
  update_chart()
}

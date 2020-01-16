/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        window.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    /**
     * Function that clears the map
     */
    clearMap() {
        var color = d3.select('#map').selectAll('.countries');
        color.attr('class', 'countries')
        color.classed('host', false);
        color.classed('team', false);
        color.classed('countries', true);
        d3.selectAll('circle').remove();


        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here.

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();
        var host = '#' + worldcupData.host_country_code;
        var teams = worldcupData.teams_iso;
        var winner = worldcupData.winner;

        var iso = worldcupData.TEAM_LIST.split(',');
        var name = worldcupData.TEAM_NAMES.split(',');
        var i = name.indexOf(winner);
        var win = '#' + iso[i];
        var color = d3.select('#map').select(host)
            .attr('class', 'countries host');
        for (i in iso){
            var col = d3.select(('#' + iso[i]))
                .classed('team', true);
        }

        var cx = (worldcupData.WIN_LON);
        var cy = (worldcupData.WIN_LAT);

        var point_win = d3.select('#map').selectAll('circle')
            .data([cx, cy]).enter().append("circle")
            .attr("r", '7px')
            .attr('class', 'gold')
            .attr("transform", function(d) {
                return "translate(" + proj([
                    cx,
                    cy
                ]) + ")";
            });
        cx = worldcupData.RUP_LON;
        cy = worldcupData.RUP_LAT;
        var point_rup = d3.select('#map').append("circle")
            .attr("r", '7px')
            .attr('class', 'silver')
            .attr("transform", function(d) {
                return "translate(" + proj([
                    cx,
                    cy
                ]) + ")";
            });

    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {
        window.proj = d3.geoConicConformal().scale(150).translate([400, 350]);
        var geoPath = d3.geoPath()
            .projection(proj);
        var g = d3.select('#map')
            .attr('width', 900)
            .attr('height', 600);
        g.selectAll('path')
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append('path')
            .attr('class', 'countries')
            .attr('id', function(d){
                return d.id;})
            .attr('d', geoPath);
        g.append('path')
            .attr('id', 'grid')
            .datum(d3.geoGraticule().stepMinor([10, 10]))
            .attr('class', 'graticule')
            .attr('d', geoPath);
        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* TODO: PART IV *******

        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

    }


}

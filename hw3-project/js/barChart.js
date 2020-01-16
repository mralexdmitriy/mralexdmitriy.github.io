/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension, allData) {
        var years = allData.map(function(d){
            return d.year;
        })
        window.selectedDimension = selectedDimension;
        var width = d3.select('#barChart').attr('width');
        var height = d3.select('#barChart').attr('height');
        var margin = {top: 5, right: 5, bottom: 50, left: 55};
        var svg = d3.select('#barChart')
            .attr('width', width)
            .attr('height', height)
            .attr('transform', 'translate(' + margin.right + ',' + margin.top + ')');

        var yearScale = d3.scaleBand()
            .domain(years)
            .range([0, (width-margin.left-margin.right)])
            .paddingInner(0.1);

        var bandwidth = yearScale.bandwidth();

        var max = d3.max(allData, function(d){ return d[selectedDimension]; })
        var dataScale = d3.scaleLinear()
            .domain([0, max])
            .range([(height-margin.top-margin.bottom), 0]);
        var xAxis = d3.axisBottom(yearScale);
        var yAxis = d3.axisLeft(dataScale);

        svg.select('#xAxis')
            .attr('transform', 'translate(' + margin.left + ',' + (height-margin.top-margin.bottom) + ')')
            .call(xAxis)
            .selectAll('text')
                .style("text-anchor", "end")
                .attr("dx", "-10px")
                .attr("dy", "-5px")
                .attr("transform", "rotate(-90)" );

        svg.select('#yAxis')
            .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
            .call(yAxis);

        window.colorScale = d3.scaleLinear()
            .domain([1, max])
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb("#092733"), d3.rgb('#807faB')]);

        var barHolder = svg.select('#bars')
        var bars = barHolder.selectAll('rect.bar')
            .data(allData)
            .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', function(d){ return (margin.left + yearScale(d.year));})
                .attr('width', bandwidth)
                .attr('y', function(d){ return dataScale(d[selectedDimension]); })
                .attr('height', function(d){ return height-margin.top-margin.bottom - dataScale(d[selectedDimension]); })
                .style('fill', function(d){ return colorScale(d[selectedDimension])})
                .on("click", barChart.chooseCup)
        var old_bars = barHolder.selectAll('rect.bar').transition()
            .attr('class', 'bar')
            .attr('x', function(d){ return (margin.left + yearScale(d.year));})
            .attr('width', bandwidth)
            .attr('y', function(d){ return dataScale(d[selectedDimension]); })
            .attr('height', function(d){ return height-margin.top-margin.bottom - dataScale(d[selectedDimension]); })
            .style('fill', function(d){ return colorScale(d[selectedDimension])});

    }

    chooseCup(d) {
        infoPanel.updateInfo(d);
        worldMap.updateMap(d);
        d3.select('.selected').classed('selected', false).classed('bar', true)
            .style('fill', function(d){ return colorScale(d[selectedDimension])});
        d3.select(this).classed('bar', false).classed('selected', true)
            .style('fill','#d20a11');
    }
}

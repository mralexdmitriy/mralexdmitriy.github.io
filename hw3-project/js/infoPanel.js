/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {
        var data = oneWorldCup;
        var bbb = d3.select('#details')
        bbb.select('#edition')
            .text(data.EDITION);
        bbb.select('#host') 
            .text(data.host)
        bbb.select('#winner')
            .text(data.winner)
        bbb.select('#silver')
            .text(data.runner_up)
        var team = bbb.select('#teams')
        team.select('ul').remove();
        team.append('ul').selectAll('li')
            .data(data.teams_names)
            .enter()
                .append('li')
                .html(String);
    }

}

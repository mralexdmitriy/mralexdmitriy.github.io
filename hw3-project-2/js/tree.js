/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {

    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {
        var tree = d3.stratify()
            .id(function(d) { return d.id; })
            .parentId(function(d) { return d.ParentGame; })
            (treeData);

        // assign the name to each node
        tree.each(function(d) {
            d.name = d.data.Team;
            });

        // set the dimensions and margins of the diagram
        var margin = {top: 20, right: 90, bottom: 30, left: 90},
            width = 500 - margin.left - margin.right,
            height = 1000 - margin.top - margin.bottom - 100;

        // declares a tree layout and assigns the size
        var treemap = d3.tree()
            .size([height, width]);

        //  assigns the data to a hierarchy using parent-child relationships
        var nodes = d3.hierarchy(tree, function(d) {
            return d.children;
            });

        // maps the node data to the tree layout
        nodes = treemap(nodes);

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#tree")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom),
            g = svg.append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        // adds the links between the nodes
        var link = g.selectAll(".link")
            .data( nodes.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function(d) {
                return "M" + d.y + "," + d.x
                + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                + " " + d.parent.y + "," + d.parent.x;
                });

        // adds each node as a group
        var node = g.selectAll(".node")
            .data(nodes.descendants())
            .enter().append("g")
            .attr("class", function(d) {
                if (d.parent == null){
                    return 'node winner'
                } else{
                    if (d.parent.data.data.Team == d.data.data.Team){
                        return 'node winner'
                    } else{
                        return 'node'
                    }
                }
            })
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")"; });

        // adds the circle to the node
        node.append("circle")
            .attr("r", 10);

        // adds the text to the node
        node.append("text")
            .attr("dy", ".35em")
            .attr("x", function(d) { return d.children ? -13 : 13; })
            .style("text-anchor", function(d) {
            return d.children ? "end" : "start"; })
            .text(function(d) { return d.data.name; });
        // ******* TODO: PART VI *******

        //Create a tree and give it a size() of 800 by 300.


        //Create a root for the tree using d3.stratify();


        //Add nodes and links to the tree.


    };

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(rows) {
        // ******* TODO: PART VII *******
        var path = d3.selectAll('.link')
            .filter(function(d){
                if (rows.value.type == 'aggregate'){
                    return (d.data.data.Team == rows.key && d.parent.data.data.Team == rows.key)
                } else{
                    return (d.data.data.Team == rows.key && d.data.data.Opponent == rows.value.Opponent) || (d.data.data.Team == rows.value.Opponent && d.data.data.Opponent == rows.key)
                }
            })
        path
            .attr('class', 'link selected')

        var label = d3.selectAll('.node').selectAll('text')
            .filter(function(d){
                if (rows.value.type == 'aggregate'){
                    return (d.data.data.Team == rows.key)
                } else{
                    var r1 = '';
                    var r2 = '';
                    if ((Object.keys(d.data).indexOf('children')+1) != 0){
                        var r1 = d.data.children[0].data.Team;
                        var r2 = d.data.children[0].data.Opponent;
                    }
                    return ((d.data.data.Team == rows.key && d.data.data.Opponent == rows.value.Opponent) ||
                    (d.data.data.Team == rows.value.Opponent && d.data.data.Opponent == rows.key) ||
                    (r1 == rows.key && r2 == rows.value.Opponent) ||
                    (r2 == rows.key && r1 == rows.value.Opponent))
                }
            })
        label
            .attr('class', 'selectedLabel')
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******
        var path = d3.selectAll('.selected')
            .attr('class', 'link')
        var label = d3.selectAll('.selectedLabel')
            .attr('class', 'label')
        // You only need two lines of code for this! No loops!
    }
}

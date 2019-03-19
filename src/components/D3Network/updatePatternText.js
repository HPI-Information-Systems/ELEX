import styles from "./styles.module.scss";

/**
 * @param selection - .gTexts
 * @param data - nodes
 * */
export default function enterUpdateExitTexts(selection, data) {
    const self = this;

    let texts = selection
      .selectAll(".text")
      .data(data, function(d) {
          return d.id;
      });

    texts.exit()
      .remove();

    let textEnter = texts.enter()
      .append("text")
      .attr("class", `text ${styles.text}`)
      .attr("y", ".3em");

    texts = textEnter.merge(texts);

    texts.attr("x", function(d) {
        return parseInt(d.props.__size, 10) + 6;
    }).text(function(d) {
        if (d.invisible || !self.showLabels) return "";

        return parseName(d.props.__label);
    });
};

function parseName(name, limit = 30) {
    if (!name) return "";
    if (name.length < limit) return name;

    return name.substring(0, limit - 3) + "...";
}

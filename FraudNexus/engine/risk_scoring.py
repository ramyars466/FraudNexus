def final_risk(ml, behavior, device, graph):

    score = (
        0.6 * ml +
        0.2 * behavior +
        0.15 * device +
        0.05 * graph
    )

    return score
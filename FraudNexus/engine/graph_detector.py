import networkx as nx

# create graph
G = nx.Graph()


# add transaction edge
def add_transaction(card, merchant):
    G.add_edge(card, merchant)


# calculate graph risk
def graph_risk(card):

    neighbors = list(G.neighbors(card))

    if len(neighbors) > 3:
        return 0.7

    elif len(neighbors) > 1:
        return 0.4

    return 0.1
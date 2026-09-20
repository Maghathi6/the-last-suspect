/**
 * Campus Graph Representation
 * Defines physical adjacency of locations for route validation.
 */
export const CampusGraph = {
    "loc_canteen": ["loc_lab", "loc_playground"],
    "loc_lab": ["loc_canteen", "loc_dept"],
    "loc_dept": ["loc_lab", "loc_main", "loc_library"],
    "loc_main": ["loc_dept", "loc_library", "loc_seminar"],
    "loc_library": ["loc_main", "loc_dept"],
    "loc_seminar": ["loc_main", "loc_playground"],
    "loc_playground": ["loc_seminar", "loc_canteen", "loc_hostel"],
    "loc_hostel": ["loc_playground", "loc_parking"],
    "loc_parking": ["loc_hostel"]
};

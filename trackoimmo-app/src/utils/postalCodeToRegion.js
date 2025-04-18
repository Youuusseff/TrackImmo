const departmentToRegion = {
    "01": "Auvergne-Rhône-Alpes", "02": "Hauts-de-France", "03": "Auvergne-Rhône-Alpes",
    "04": "Provence-Alpes-Côte d'Azur", "05": "Provence-Alpes-Côte d'Azur",
    "06": "Provence-Alpes-Côte d'Azur", "07": "Auvergne-Rhône-Alpes", "08": "Grand Est",
    "09": "Occitanie", "10": "Grand Est", "11": "Occitanie", "12": "Occitanie",
    "13": "Provence-Alpes-Côte d'Azur", "14": "Normandie", "15": "Auvergne-Rhône-Alpes",
    "16": "Nouvelle-Aquitaine", "17": "Nouvelle-Aquitaine", "18": "Centre-Val de Loire",
    "19": "Nouvelle-Aquitaine", "2A": "Corse", "2B": "Corse",
    "21": "Bourgogne-Franche-Comté", "22": "Bretagne", "23": "Nouvelle-Aquitaine",
    "24": "Nouvelle-Aquitaine", "25": "Bourgogne-Franche-Comté", "26": "Auvergne-Rhône-Alpes",
    "27": "Normandie", "28": "Centre-Val de Loire", "29": "Bretagne", "30": "Occitanie",
    "31": "Occitanie", "32": "Occitanie", "33": "Nouvelle-Aquitaine", "34": "Occitanie",
    "35": "Bretagne", "36": "Centre-Val de Loire", "37": "Centre-Val de Loire",
    "38": "Auvergne-Rhône-Alpes", "39": "Bourgogne-Franche-Comté", "40": "Nouvelle-Aquitaine",
    "41": "Centre-Val de Loire", "42": "Auvergne-Rhône-Alpes", "43": "Auvergne-Rhône-Alpes",
    "44": "Pays de la Loire", "45": "Centre-Val de Loire", "46": "Occitanie",
    "47": "Nouvelle-Aquitaine", "48": "Occitanie", "49": "Pays de la Loire",
    "50": "Normandie", "51": "Grand Est", "52": "Grand Est", "53": "Pays de la Loire",
    "54": "Grand Est", "55": "Grand Est", "56": "Bretagne", "57": "Grand Est",
    "58": "Bourgogne-Franche-Comté", "59": "Hauts-de-France", "60": "Hauts-de-France",
    "61": "Normandie", "62": "Hauts-de-France", "63": "Auvergne-Rhône-Alpes",
    "64": "Nouvelle-Aquitaine", "65": "Occitanie", "66": "Occitanie",
    "67": "Grand Est", "68": "Grand Est", "69": "Auvergne-Rhône-Alpes",
    "70": "Bourgogne-Franche-Comté", "71": "Bourgogne-Franche-Comté",
    "72": "Pays de la Loire", "73": "Auvergne-Rhône-Alpes", "74": "Auvergne-Rhône-Alpes",
    "75": "Île-de-France", "76": "Normandie", "77": "Île-de-France", "78": "Île-de-France",
    "79": "Nouvelle-Aquitaine", "80": "Hauts-de-France", "81": "Occitanie",
    "82": "Occitanie", "83": "Provence-Alpes-Côte d'Azur", "84": "Provence-Alpes-Côte d'Azur",
    "85": "Pays de la Loire", "86": "Nouvelle-Aquitaine", "87": "Nouvelle-Aquitaine",
    "88": "Grand Est", "89": "Bourgogne-Franche-Comté", "90": "Bourgogne-Franche-Comté",
    "91": "Île-de-France", "92": "Île-de-France", "93": "Île-de-France",
    "94": "Île-de-France", "95": "Île-de-France"
  };
  
  export function postalCodeToRegion(postalCode) {
    if (!postalCode) return "Inconnu";
    const postal = postalCode.toString().padStart(5, "0");
    let department = postalCode.toString().substring(0, 2);
  
    if (department === "20") {
      if (postal.startsWith("2A")) department = "2A";
      else if (postal.startsWith("2B")) department = "2B";
    }
  
    return departmentToRegion[department] || "Inconnu";
  }
  
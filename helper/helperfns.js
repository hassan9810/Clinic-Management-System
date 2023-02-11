const filterData = (model, query, fieldsToPopulate = []) => {
  let filter = {};
  for (let key in query) {
    if (typeof query[key] === "object") {
      for (let nestedKey in query[key]) {
        filter[`${key}.${nestedKey}`] = query[key][nestedKey];
      }
    } else {
      let value = key;
      if (value.includes("<")) {
        value.charAt(value.length - 1) == "<"
          ? (filter[key.slice(0, key.indexOf("<"))] = { $lte: query[key] })
          : (filter[key.slice(0, key.indexOf("<"))] = {
              $lt: +value.slice(value.indexOf("<") + 1),
            });
      } else if (value.includes(">")) {
        value.charAt(value.length - 1) == ">"
          ? (filter[key.slice(0, key.indexOf(">"))] = { $gte: query[key] })
          : (filter[key.slice(0, key.indexOf(">"))] = {
              $gt: +value.slice(value.indexOf(">") + 1),
            });
      } else {
        filter[key] = query[key];
      }
    }
  }
  return fieldsToPopulate.length
    ? model.find(filter).populate(fieldsToPopulate)
    : model.find(filter);
};

const paginateData = (data, query) => {
  let page = query.page || 1;
  let limit = query.limit || 10;
  return data.slice((page - 1) * limit, page * limit);
};

const sortData = (data, query) => {
  let sortBy = query.sortBy || "_id";
  let order = query.order || "asc";
  let orderValue = order === "asc" ? 1 : -1;

  return data.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return -1 * orderValue;
    if (a[sortBy] > b[sortBy]) return 1 * orderValue;
    return 0;
  });
};

const sliceData = (data, query) => {
  let start = query.start || 0;
  let end = query.end || data.length;
  return data.slice(start, end);
};

const fillClinicServices = (specility) => {
  switch (specility) {
    //
    case "Pediatrics": {
      return [
        {
          name: "Well-child visits",
          cost: 50,
        },
        {
          name: "Immunizations",
          cost: 50,
        },
        {
          name: "Medical Consult",
          cost: 30,
        },
        {
          name: "Ear Piercing",
          cost: 80,
        },
        {
          name: "Ear cleaning",
          cost: 60,
        },
        {
          name: "Tongue tie release",
          cost: 40,
        },
        {
          name: "Hearing loss evaluation",
          cost: 80,
        },
        {
          name: "Ear infection treatment",
          cost: 70,
        },
        {
          name: "Throat infection treatment",
          cost: 150,
        },
        {
          name: "Thyroid mass evaluation",
          cost: 90,
        },
      ];
    }
    //
    case "Women's Health": {
      return [
        {
          name: "Annual pelvic exam",
          cost: 50,
        },
        {
          name: "Pap smear",
          cost: 60,
        },
        {
          name: "HPV testing",
          cost: 70,
        },
        {
          name: "Breast exam",
          cost: 40,
        },
        {
          name: "Contraception counseling",
          cost: 80,
        },
        {
          name: "Menopause management",
          cost: 100,
        },
        {
          name: "Infertility evaluation",
          cost: 150,
        },
        {
          name: "Pregnancy planning and management",
          cost: 80,
        },
        {
          name: "STI testing",
          cost: 60,
        },
        {
          name: "Vaginal infection treatment",
          cost: 50,
        },
      ];
    }
    //
    case "Cardiology": {
      return [
        {
          name: "Heart health evaluation",
          cost: 60,
        },
        {
          name: "Stress test",
          cost: 80,
        },
        {
          name: "Cholesterol screening",
          cost: 50,
        },
        {
          name: "Echocardiogram",
          cost: 150,
        },
        {
          name: "Cardiac catheterization",
          cost: 200,
        },
        {
          name: "Electrophysiology study",
          cost: 170,
        },
        {
          name: "Pacemaker implantation",
          cost: 180,
        },
        {
          name: "Ablation procedure",
          cost: 160,
        },
        {
          name: "Angioplasty",
          cost: 190,
        },
        {
          name: "Coronary artery bypass surgery",
          cost: 220,
        },
      ];
    }
    //
    case "Neurology": {
      return [
        {
          name: "Headache evaluation and treatment",
          cost: 50,
        },
        {
          name: "Dizziness evaluation",
          cost: 60,
        },
        {
          name: "Seizure evaluation and management",
          cost: 70,
        },
        {
          name: "Stroke evaluation and management",
          cost: 80,
        },
        {
          name: "Neck and back pain evaluation and management",
          cost: 90,
        },
        {
          name: "Nerve and muscle disorder evaluation and management",
          cost: 100,
        },
        {
          name: "Multiple sclerosis management",
          cost: 120,
        },
        {
          name: "Parkinson's disease management",
          cost: 150,
        },
        {
          name: "Epilepsy management",
          cost: 170,
        },
        {
          name: "Memory and cognitive disorder evaluation and management",
          cost: 200,
        },
      ];
    }
    //
    case "Dental": {
      return [
        {
          name: "Dental cleaning",
          cost: 75,
        },
        {
          name: "Teeth whitening",
          cost: 150,
        },
        {
          name: "Dental filling",
          cost: 100,
        },
        {
          name: "Root canal",
          cost: 175,
        },
        {
          name: "Crown placement",
          cost: 200,
        },
        {
          name: "Dental implant placement",
          cost: 250,
        },
        {
          name: "Dental extraction",
          cost: 150,
        },
        {
          name: "Orthodontic consultation",
          cost: 75,
        },
        {
          name: "Orthodontic treatment",
          cost: 250,
        },
        {
          name: "Periodontal treatment",
          cost: 175,
        },
      ];
    }
    //
    case "Physical Therapy": {
      return [
        {
          name: "Diagnostic evaluation",
          cost: 50,
        },
        {
          name: "Medication management",
          cost: 70,
        },
        {
          name: "Psychotherapy",
          cost: 80,
        },
        {
          name: "Cognitive behavioral therapy",
          cost: 90,
        },
        {
          name: "Family therapy",
          cost: 100,
        },
        {
          name: "Group therapy",
          cost: 110,
        },
        {
          name: "Mood disorder treatment",
          cost: 120,
        },
        {
          name: "Anxiety disorder treatment",
          cost: 150,
        },
        {
          name: "Stress management",
          cost: 160,
        },
        {
          name: "Addiction treatment",
          cost: 180,
        },
      ];
    }
    //
    case "Radiologic": {
      return [
        {
          name: "X-ray",
          cost: 50,
        },
        {
          name: "MRI",
          cost: 70,
        },
        {
          name: "CT scan",
          cost: 80,
        },
        {
          name: "Ultrasound",
          cost: 90,
        },
        {
          name: "Nuclear medicine",
          cost: 100,
        },
        {
          name: "Mammogram",
          cost: 110,
        },
        {
          name: "Bone density test",
          cost: 120,
        },
        {
          name: "Angiogram",
          cost: 150,
        },
        {
          name: "PET scan",
          cost: 160,
        },
        {
          name: "Interventional radiology",
          cost: 180,
        },
      ];
    }
    //
    case "Dermatology": {
      return [
        {
          name: "Acne treatment",
          cost: 60,
        },
        {
          name: "Skin cancer screening",
          cost: 70,
        },
        {
          name: "Mole removal",
          cost: 80,
        },
        {
          name: "Eczema treatment",
          cost: 90,
        },
        {
          name: "Psoriasis treatment",
          cost: 100,
        },
        {
          name: "Rosacea treatment",
          cost: 110,
        },
        {
          name: "Botox injections",
          cost: 120,
        },
        {
          name: "Filler injections",
          cost: 150,
        },
        {
          name: "Laser hair removal",
          cost: 160,
        },
        {
          name: "Microdermabrasion",
          cost: 180,
        },
      ];
    }
    //
    case "Surgical": {
      return [
        {
          name: "Appendectomy",
          cost: 200,
        },
        {
          name: "Hernia repair",
          cost: 150,
        },
        {
          name: "Gallbladder removal",
          cost: 175,
        },
        {
          name: "Breast biopsy",
          cost: 175,
        },
        {
          name: "Lung biopsy",
          cost: 200,
        },
        {
          name: "Skin lesion removal",
          cost: 100,
        },
        {
          name: "Thyroidectomy",
          cost: 150,
        },
        {
          name: "Laparoscopic surgery",
          cost: 175,
        },
        {
          name: "Liposuction",
          cost: 175,
        },
        {
          name: "Colon resection",
          cost: 200,
        },
      ];
    }
  }
};

const mapSpecilityToSpecilization = (specility) => {
  switch (specility) {
    case "Pediatrician": {
      return "Pediatrics";
    }
    case "Gynecologist": {
      return "Women's Health";
    }
    case "Cardiologist": {
      return "Cardiology";
    }
    case "Dermatologist": {
      return "Dermatology";
    }
    case "Psychiatrist": {
      return "Physical Therapy";
    }
    case "Neurologist": {
      return "Neurology";
    }
    case "Radiologist": {
      return "Radiologic";
    }
    case "Dentist": {
      return "Dental";
    }
    case "Surgeon": {
      return "Surgical";
    }
    default: {
      return "Wrong";
    }
  }
};

const dateBetween = (date1, date2, date3) => {
  return (
    new Date(`${new Date().toLocaleDateString()} ${date1}`) >=
      new Date(`${new Date().toLocaleDateString()} ${date2}`) &&
    new Date(`${new Date().toLocaleDateString()} ${date1}`) <
      new Date(`${new Date().toLocaleDateString()} ${date3}`)
  );
};

const mapDateToDay = (date) => {
  let splitData = date.split("/");
  let dateReformated = `${splitData[1]}/${splitData[0]}/${splitData[2]}`;
  let number = new Date(dateReformated).getDay();
  switch (number) {
    case 0:
      return "Monday";
    case 1:
      return "Tuesday";
    case 2:
      return "Wednesday";
    case 3:
      return "Thursday";
    case 4:
      return "Friday";
    case 5:
      return "Saturday";
    case 6:
      return "Sunday";
  }
};

module.exports = {
  filterData,
  paginateData,
  sortData,
  sliceData,
  fillClinicServices,
  mapSpecilityToSpecilization,
  dateBetween,
  mapDateToDay,
};

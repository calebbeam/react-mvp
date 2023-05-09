const Result = (props) => {
  const { lifterData } = props;
  if (!Array.isArray(lifterData)) return null;


  function CalculateDots(state) {
    if (state === null) {
      return ""; // or any appropriate fallback value when state is null
    }

    const maleCoeff = [
      -307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093,
    ];
    const femaleCoeff = [
      -57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706,
    ];

    let denominator = state.gender === "female" ? femaleCoeff[0] : maleCoeff[0];
    let coeff = state.gender === "female" ? femaleCoeff : maleCoeff;
    let maxbw = state.gender === "female" ? 150 : 210;
    let bw = Math.min(Math.max(state.weight, 40), maxbw) * 0.45359237;
    let weightLifted =
      (Number(state.squat) + Number(state.bench) + Number(state.deadlift)) *
      0.45359237;

    let weightLiftedLbs =
      Number(state.squat) + Number(state.bench) + Number(state.deadlift);

    for (let i = 1; i < coeff.length; i++) {
      denominator += coeff[i] * Math.pow(bw, i);
    }

    let score = (500 / denominator) * weightLifted;
    return { score: score.toFixed(2), weightLiftedLbs: weightLiftedLbs };
  }

  function Calculate_IPF(state) {
    if (state === null) {
      return "";
    }
    var competition;

    if (state.equipped == false) {
      competition = "CLPL";
    } else {
      competition = "EQPL";
    }

    const maleCoeffCLPL = [310.67, 857.785, 53.216, 147.0835];
    // const maleCoeffCLBN = [86.4745, 259.155, 17.5785, 53.122];
    const maleCoeffEQPL = [387.265, 1121.28, 80.6324, 222.4896];
    // const maleCoeffEQBN = [133.94, 441.465, 35.3938, 113.0057];

    const femaleCoeffCLPL = [125.1435, 228.03, 34.5246, 86.8301];
    // const femaleCoeffCLBN = [25.0485, 43.848, 6.7172, 13.952];
    const femaleCoeffEQPL = [176.58, 373.315, 48.4534, 110.0103];
    // const femaleCoeffEQBN = [49.106, 124.209, 23.199, 67.4926];

    var coeff
    if (state.gender == "female") {
      switch (competition) {
        case "CLBN":
          coeff = femaleCoeffCLBN;
          break;
        case "EQPL":
          coeff = femaleCoeffEQPL;
          break;
        case "EQBN":
          coeff = femaleCoeffEQBN;
          break;
        case "CLPL":
        default:
          coeff = femaleCoeffCLPL;
          break;
      }
    } else {
      switch (competition) {
        case "CLBN":
          coeff = maleCoeffCLBN;
          break;
        case "EQPL":
          coeff = maleCoeffEQPL;
          break;
        case "EQBN":
          coeff = maleCoeffEQBN;
          break;
        case "CLPL":
        default:
          coeff = maleCoeffCLPL;
          break;
      }
    }
    if (state.weight < 40) return "0.00";

    let lnbw = Math.log(state.weight);
    let weightLifted =
      (Number(state.squat) + Number(state.bench) + Number(state.deadlift));
    
    weightLifted = weightLifted * 0.45359237
    let score =
      500 +
      100 *
        ((weightLifted - (coeff[0] * lnbw - coeff[1])) /
          (coeff[2] * lnbw - coeff[3]));
    return score < 0 ? "0.00" : score.toFixed(2);
  }


  return (
    <div className="resultContainer">
      {lifterData.map((result, index) => (
        <div className="results" key={index}>
          <i
            className="far fa-trash-alt"
            onClick={() => props.deletePost(lifterData[index])}
          ></i>
          <h4>{index == 0 ? 'Current \n Score' : 'Previous Score'}</h4>
          <p>Gender: {result?.gender}</p>
          {/* <p>Body Weight: {result?.weight}</p> */}
          <p>Squat: {result?.squat}</p>
          <p>Bench: {result?.bench}</p>
          <p>Deadlift: {result?.deadlift}</p>
          <p>Event: {result?.equipped == true ? "Equipped" : "Raw"}</p>
          <p>
            {result?.weight +
              "lbs lifting " +
              CalculateDots(result).weightLiftedLbs + ' lbs'}
          </p>
          <h3>Dots Score: {CalculateDots(result).score}</h3>
          <h3>IPF Score: {Calculate_IPF(result)}</h3>
        </div>
      ))}
    </div>
  );
};

export default Result;

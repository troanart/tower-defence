import React, { useState, useCallback } from "react";

interface Enemy {
  name: string;
  distance: number;
  speed: number;
}

const labels = {
  NO_ENEMIS: "В настоящее время врагов нет.",
  GAME_NAME: 'Игра "Защита башни"',
  SHOT_RANGE: "Дальность стрельбы башни:",
  ADD_ENEMIES: "Добавить врага",
  START_GAME: "Начать игру",
  SHOW_RULES: "Показать правила",
  ENEMY_LIST: "Список врагов",
  ENEMY_NAME: "Имя врага:",
  DISTANCE: "Начальное расстояние:",
  SPEED: "Скорость:",
  SAVE: "Сохранить",
  CLUE: " Кликните 2 раза на врага, чтобы изменить его параметры",
  GAME_RULES: "Правила игры",
  CONDITION_1:
    " 1) На каждом ходу сначала башня стреляет один раз, затем каждый враг перемещается к башне.",
  CONDITION_2: "2) Нужно убить врагов как можно быстрее",
  CONDITION_3: "3) Если враг достигнет башни, вы проиграете.",
  CLOSE_RULES: "Закрыть",
};

const TowerDefenseGame: React.FC = () => {
  const [towerRange, setTowerRange] = useState<number>(50);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [gameResult, setGameResult] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number,
      key: keyof Enemy
    ) => {
      const newEnemies = [...enemies];
      newEnemies[index] = {
        ...newEnemies[index],
        [key]: parseInt(e.target.value),
      };
      setEnemies(newEnemies);
    },
    [enemies]
  );

  const handleSaveChanges = (index: number) => {
    setEditingIndex(null);
  };

  const handleAddEnemy = useCallback(() => {
    setGameResult("");
    if (enemies.length >= 9) {
      alert("Вы не можете добавить больше 9 врагов.");
      return;
    }
    let randomName = "";
    let isUnique = false;

    while (!isUnique) {
      randomName = `Bot${Math.floor(Math.random() * 9) + 1}`;

      if (!enemies.some((enemy) => enemy.name === randomName)) {
        isUnique = true;
      }
    }

    const randomDistance = Math.floor(Math.random() * 15) * 10 + 10;

    const randomSpeed = (Math.floor(Math.random() * 6) + 1) * 5;

    setEnemies((prevEnemies) => [
      ...prevEnemies,
      { name: randomName, distance: randomDistance, speed: randomSpeed },
    ]);
  }, [enemies]);

  const calculateMinimumTowerRange = useCallback(() => {
    if (enemies.length === 0 || turns === 0) {
      console.log("Набор врагов пуст или количество ходов равно 0");
      return;
    }

    let maxSpeed = 0;
    enemies.forEach((enemy) => {
      if (enemy.speed > maxSpeed) {
        maxSpeed = enemy.speed;
      }
    });

    const minRange = maxSpeed * turns;
    console.log(
      `Минимальная дальность стрельбы башни для победы: ${minRange} м`
    );
  }, [enemies, turns]);

  const playTurns = useCallback(() => {
    let currentTurn = 0;
    let step = 1;
    let defeated = false;

    while (enemies.length > 0 && !defeated) {
      currentTurn++;
      let closestEnemyIndex = -1;
      let minDistance = towerRange;

      for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (enemy.distance <= towerRange) {
          if (enemy.distance < minDistance) {
            minDistance = enemy.distance;
            closestEnemyIndex = i;
          }
        }
      }

      if (closestEnemyIndex !== -1) {
        const closestEnemy = enemies[closestEnemyIndex];
        console.log(
          `Ход ${currentTurn}: Убит ${closestEnemy.name} на дистанции в ${closestEnemy.distance} м`
        );
        enemies.splice(closestEnemyIndex, 1);
      }

      enemies.forEach((enemy) => {
        enemy.distance -= enemy.speed;
        if (enemy.distance <= 0) {
          defeated = true;
        }
      });

      if (defeated) {
        setTowerRange(towerRange * 2);
      }

      step++;
    }

    if (!defeated) {
      setGameResult(`Башня ВЫИГРЫВАЕТ за ${currentTurn} хода(ов)`);
      console.log(`Башня ВЫИГРЫВАЕТ за ${currentTurn} хода(ов)`);
    } else {
      setGameResult("Башня ПРОИГРЫВАЕТ");
      calculateMinimumTowerRange();
    }

    setTurns(currentTurn);
  }, [
    enemies,
    towerRange,
    setTowerRange,
    setGameResult,
    calculateMinimumTowerRange,
  ]);

  const startGame = useCallback(() => {
    setGameResult("");
    if (
      enemies.length === 0 ||
      enemies.some((enemy) => enemy.name.trim() === "")
    ) {
      setGameResult("Добавьте врагов с корректными именами перед началом игры");
      return;
    }
    playTurns();
  }, [enemies, playTurns]);

  const toggleEditMode = useCallback((index: number) => {
    setEditingIndex((prevIndex) => (prevIndex === index ? null : index));
  }, []);

  const openRulesModal = () => {
    setShowRulesModal(true);
  };

  const closeRulesModal = () => {
    setShowRulesModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8  lg:px-8 lg:max-w-[1000px] ">
      <h1 className="text-2xl text-center mb-5 ">{labels.GAME_NAME}</h1>
      <div className="mb-5 flex flex-wrap items-baseline justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <label className="text-lg">{labels.SHOT_RANGE}</label>
        <input
          className="text-xl  p-2 border border-emerald-500 rounded outline-none  hover:border-sky-600 focus:border-sky-600 transition-colors duration-300"
          type="number"
          value={towerRange}
          onChange={(e) => setTowerRange(parseInt(e.target.value))}
        />
        <div className="flex w-full sm:pt-4  justify-between  lg:justify-center  lg:mt-5">
          <button
            className="bg-emerald-500  mx-1 mt-1 lg:mx-8 text-white p-2 rounded-md border border-emerald-500 hover:bg-emerald-600 transition-colors duration-300"
            onClick={handleAddEnemy}>
            {labels.ADD_ENEMIES}
          </button>
          <button
            className="bg-emerald-500 mx-1  mt-1 lg:mx-8  text-white p-2 rounded-md border border-emerald-500 hover:bg-emerald-600 transition-colors duration-300"
            onClick={startGame}>
            {labels.START_GAME}
          </button>
          <button
            className="bg-emerald-500 mx-1  lg:mx-8 mt-1 text-white p-2 rounded-md border border-emerald-500 hover:bg-emerald-600 transition-colors duration-300"
            onClick={openRulesModal}>
            {labels.SHOW_RULES}
          </button>
        </div>
      </div>
      <div className="border mx-auto w-full  relative px-4 py-8 rounded border-emerald-500">
        <h2 className="top-0 left-0 bg-emerald-500 rounded text-lg absolute text-white w-fit p-1">
          {labels.ENEMY_LIST}
        </h2>
        {enemies.length === 0 && (
          <p className="text-lg text-center">{labels.NO_ENEMIS}</p>
        )}
        {enemies.map((enemy, index) => (
          <div key={index}>
            <div
              className={`border m-2 rounded p-2 ${
                editingIndex === index ? "animate-pulse" : ""
              }`}>
              {editingIndex === index ? (
                <>
                  <label className="text-lg m-2"> {labels.ENEMY_NAME}</label>
                  <input
                    className="tex-xl w-[95px] p-2  border border-emerald-500 rounded outline-none  mx-2 hover:border-sky-600 focus:border-sky-600 transition-colors duration-300"
                    type="text"
                    value={enemy.name}
                    onChange={(e) => handleInputChange(e, index, "name")}
                  />
                  <label className="text-lg m-2"> {labels.DISTANCE}</label>
                  <input
                    className="tex-xl w-[95px] p-2  border border-emerald-500 rounded outline-none  mx-2 hover:border-sky-600 focus:border-sky-600 transition-colors duration-300"
                    type="number"
                    value={enemy.distance}
                    onChange={(e) => handleInputChange(e, index, "distance")}
                  />
                  <label className="text-lg m-2"> {labels.SPEED}</label>
                  <input
                    className="tex-xl w-[95px] p-2  border border-emerald-500 rounded outline-none  mx-2 hover:border-sky-600 focus:border-sky-600 transition-colors duration-300"
                    type="number"
                    value={enemy.speed}
                    onChange={(e) => handleInputChange(e, index, "speed")}
                  />
                  <button
                    className="bg-emerald-500 text-white p-2 rounded-md border border-emerald-500 hover:bg-emerald-600 transition-colors duration-300"
                    onClick={() => handleSaveChanges(index)}>
                    {labels.SAVE}
                  </button>
                </>
              ) : (
                <>
                  <span
                    className="text-lg m-4"
                    onDoubleClick={() => toggleEditMode(index)}>
                    {labels.ENEMY_NAME} {enemy.name}
                  </span>
                  <span
                    className="text-lg m-4"
                    onDoubleClick={() => toggleEditMode(index)}>
                    {labels.DISTANCE} {enemy.distance}
                  </span>
                  <span
                    className="text-lg m-4"
                    onDoubleClick={() => toggleEditMode(index)}>
                    {labels.SPEED} {enemy.speed}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm mt-5 bg-emerald-500 rounded w-fit mx-auto text-white p-1">
        {labels.CLUE}
      </p>

      <div className=" mt-5 text-2xl text-center">
        {gameResult && (
          <p
            className={
              gameResult.includes("ВЫИГРЫВАЕТ")
                ? "text-emerald-500 font-bold"
                : "text-red-500 font-bold"
            }>
            {gameResult}
          </p>
        )}
      </div>

      {showRulesModal && (
        <div className="fixed top-0 left-0 z-50 w-full h-full  bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 max-w-[350px] rounded-md">
            <h2 className="text-2xl mb-4"> {labels.GAME_RULES}</h2>

            <p className="mb-2">{labels.CONDITION_1}</p>
            <p className="mb-2"> {labels.CONDITION_2}</p>
            <p className="mb-2">{labels.CONDITION_3}</p>
            <button
              className="bg-emerald-500 text-white px-4 py-2 rounded-md mt-4"
              onClick={closeRulesModal}>
              {labels.CLOSE_RULES}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TowerDefenseGame;

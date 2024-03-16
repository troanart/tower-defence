import React, { useState } from "react";

interface Enemy {
  name: string;
  distance: number;
  speed: number;
}

const TowerDefenseGame: React.FC = () => {
  const [towerRange, setTowerRange] = useState<number>(50);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [gameResult, setGameResult] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false); // Состояние для управления видимостью модального окна

  const handleInputChange = (
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
  };

  const handleSaveChanges = (index: number) => {
    setEditingIndex(null);
  };

  const handleAddEnemy = () => {
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

    setEnemies([
      ...enemies,
      { name: randomName, distance: randomDistance, speed: randomSpeed },
    ]);
  };

  const startGame = () => {
    if (
      enemies.length === 0 ||
      enemies.some((enemy) => enemy.name.trim() === "")
    ) {
      setGameResult("Добавьте врагов с корректными именами перед началом игры");
      return;
    }
    playTurns();
  };

  const playTurns = () => {
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
          ` Ход ${currentTurn}: Убит ${closestEnemy.name} на дистанции в ${closestEnemy.distance} м`
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
      setGameResult(`Башня ПРОИГРЫВАЕТ`);
      calculateMinimumTowerRange();
    }

    setTurns(currentTurn);
  };

  const toggleEditMode = (index: number) => {
    setEditingIndex(index === editingIndex ? null : index);
  };

  const calculateMinimumTowerRange = () => {
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
  };

  const openRulesModal = () => {
    setShowRulesModal(true);
  };

  const closeRulesModal = () => {
    setShowRulesModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl text-center mb-5 ">Игра "Защита башни"</h1>
      <div className="mb-5 flex flex-wrap justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <label className="text-lg">Дальность стрельбы башни:</label>
        <input
          className="text-xl sm:mb-5 md:mb-8 p-2 border border-emerald-500 rounded outline-none mx-2 hover:border-sky-600 focus:border-sky-600 transition-colors duration-300"
          type="number"
          value={towerRange}
          onChange={(e) => setTowerRange(parseInt(e.target.value))}
        />
        <button
          className="bg-emerald-500 text-white p-2 rounded-md border border-emerald-500 hover:bg-emerald-600 transition-colors duration-300"
          onClick={handleAddEnemy}>
          Добавить врага
        </button>
        <button
          className="bg-emerald-500 text-white p-2 rounded-md border border-emerald-500 hover:bg-emerald-600 transition-colors duration-300"
          onClick={startGame}>
          Начать игру
        </button>
        <button
          className="bg-emerald-500 text-white p-2 rounded-md border border-emerald-500 hover:bg-emerald-600 transition-colors duration-300"
          onClick={openRulesModal}>
          Показать правила
        </button>
      </div>
      <div className="border mx-auto w-full sm:w-[750px] relative px-4 py-8 rounded border-emerald-500">
        <h2 className="top-0 left-0 bg-emerald-500 rounded text-lg absolute text-white w-fit p-1">
          Список врагов
        </h2>
        {enemies.map((enemy, index) => (
          <div key={index}>
            <div
              className={`border m-2 rounded p-2 ${
                editingIndex === index ? "animate-pulse" : ""
              }`}>
              {editingIndex === index ? (
                <>
                  <label className="text-lg m-4">Имя врага:</label>
                  <input
                    className="tex-xl w-[120px] p-2  border border-emerald-500 rounded outline-none  mx-2 hover:border-sky-600 focus:border-sky-600 transition-colors duration-300"
                    type="text"
                    value={enemy.name}
                    onChange={(e) => handleInputChange(e, index, "name")}
                  />
                  <label className="text-lg m-4">Начальное расстояние:</label>
                  <input
                    className="tex-xl w-[120px] p-2  border border-emerald-500 rounded outline-none  mx-2 hover:border-sky-600 focus:border-sky-600 transition-colors duration-300"
                    type="number"
                    value={enemy.distance}
                    onChange={(e) => handleInputChange(e, index, "distance")}
                  />
                  <label className="text-lg m-4">Скорость:</label>
                  <input
                    className="tex-xl w-[120px] p-2  border border-emerald-500 rounded outline-none  mx-2 hover:border-sky-600 focus:border-sky-600 transition-colors duration-300"
                    type="number"
                    value={enemy.speed}
                    onChange={(e) => handleInputChange(e, index, "speed")}
                  />
                  <button
                    className="bg-emerald-500 text-white p-2 rounded-md border border-emerald-500 hover:bg-emerald-600 transition-colors duration-300"
                    onClick={() => handleSaveChanges(index)}>
                    Сохранить
                  </button>
                </>
              ) : (
                <>
                  <span
                    className="text-lg m-4"
                    onDoubleClick={() => toggleEditMode(index)}>
                    Имя врага: {enemy.name}
                  </span>
                  <span
                    className="text-lg m-4"
                    onDoubleClick={() => toggleEditMode(index)}>
                    Начальное расстояние: {enemy.distance}
                  </span>
                  <span
                    className="text-lg m-4"
                    onDoubleClick={() => toggleEditMode(index)}>
                    Скорость: {enemy.speed}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

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
            <h2 className="text-2xl mb-4">Правила игры</h2>

            <p className="mb-2">
              1) На каждом ходу сначала башня стреляет один раз, затем каждый
              враг перемещается к башне.
            </p>

            <p className="mb-2"> 2) Нужно убить врагов как можно быстрее</p>
            <p className="mb-2">
              {" "}
              3) Если враг достигнет башни, вы проиграете.
            </p>
            <button
              className="bg-emerald-500 text-white px-4 py-2 rounded-md mt-4"
              onClick={closeRulesModal}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TowerDefenseGame;

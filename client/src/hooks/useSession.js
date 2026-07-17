import { useReducer, useCallback } from "react";

const initialState = {
  view: "input",       // input | flashcard | quiz | results
  topic: "",
  cards: [],
  quiz: [],
  currentIndex: 0,
  known: new Set(),
  wrong: new Set(),
  score: 0,
  answered: {},        // { [questionId]: selectedIndex }
  isRetest: false,
  retestIds: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_SESSION":
      return {
        ...initialState,
        topic: action.payload.topic,
        cards: action.payload.cards,
        quiz: action.payload.quiz,
        view: "flashcard",
      };

    case "SET_VIEW":
      return { ...state, view: action.view, currentIndex: 0 };

    case "NEXT_CARD":
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, activeCards(state).length - 1),
      };

    case "PREV_CARD":
      return { ...state, currentIndex: Math.max(state.currentIndex - 1, 0) };

    case "MARK_KNOWN": {
      const known = new Set(state.known);
      known.add(action.id);
      const wrong = new Set(state.wrong);
      wrong.delete(action.id);
      return { ...state, known };
    }

    case "MARK_LEARNING": {
      const wrong = new Set(state.wrong);
      wrong.add(action.id);
      const known = new Set(state.known);
      known.delete(action.id);
      return { ...state, wrong };
    }

    case "ANSWER_QUESTION": {
      const { id, selected, correct } = action;
      if (state.answered[id] !== undefined) return state; // already answered
      const isCorrect = selected === correct;
      const newWrong = new Set(state.wrong);
      if (!isCorrect) newWrong.add(id);
      return {
        ...state,
        answered: { ...state.answered, [id]: selected },
        score: isCorrect ? state.score + 1 : state.score,
        wrong: newWrong,
      };
    }

    case "NEXT_QUESTION":
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, activeQuiz(state).length - 1),
      };

    case "FINISH_QUIZ":
      return { ...state, view: "results" };

    case "START_RETEST": {
      const retestIds = [...state.wrong];
      if (retestIds.length === 0) return state;
      return {
        ...state,
        view: "quiz",
        isRetest: true,
        retestIds,
        currentIndex: 0,
        score: 0,
        answered: {},
        wrong: new Set(),
      };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

function activeCards(state) {
  return state.cards;
}

function activeQuiz(state) {
  if (state.isRetest) {
    return state.quiz.filter((q) => state.retestIds.includes(q.id));
  }
  return state.quiz;
}

export function useSession() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadSession = useCallback((data) => {
    dispatch({ type: "LOAD_SESSION", payload: data });
  }, []);

  const setView = useCallback((view) => dispatch({ type: "SET_VIEW", view }), []);
  const nextCard = useCallback(() => dispatch({ type: "NEXT_CARD" }), []);
  const prevCard = useCallback(() => dispatch({ type: "PREV_CARD" }), []);
  const markKnown = useCallback((id) => dispatch({ type: "MARK_KNOWN", id }), []);
  const markLearning = useCallback((id) => dispatch({ type: "MARK_LEARNING", id }), []);
  const answerQuestion = useCallback((id, selected, correct) =>
    dispatch({ type: "ANSWER_QUESTION", id, selected, correct }), []);
  const nextQuestion = useCallback(() => dispatch({ type: "NEXT_QUESTION" }), []);
  const finishQuiz = useCallback(() => dispatch({ type: "FINISH_QUIZ" }), []);
  const startRetest = useCallback(() => dispatch({ type: "START_RETEST" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const currentCards = activeCards(state);
  const currentQuiz = activeQuiz(state);

  return {
    state,
    currentCards,
    currentQuiz,
    loadSession,
    setView,
    nextCard,
    prevCard,
    markKnown,
    markLearning,
    answerQuestion,
    nextQuestion,
    finishQuiz,
    startRetest,
    reset,
  };
}

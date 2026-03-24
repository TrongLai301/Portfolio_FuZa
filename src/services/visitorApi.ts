const NAMESPACE = "fuzax_portfolio_301";
const KEY = "visit_count";
const BASE_URL = `https://api.counterapi.dev/v1`;

export const getVisitCount = async (): Promise<number> => {
  try {
    // GET requires trailing slash on this service
    const res = await fetch(`${BASE_URL}/${NAMESPACE}/${KEY}/`);
    const data = await res.json();
    return data.count || 0;
  } catch {
    return 0;
  }
};

export const hitVisitCount = async (): Promise<number> => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const lastVisit = localStorage.getItem("last_visit_date");

    if (lastVisit === today) {
      return await getVisitCount();
    }

    // UP increment MUST NOT have trailing slash or it fails with CORS
    const res = await fetch(`${BASE_URL}/${NAMESPACE}/${KEY}/up`);
    const data = await res.json();
    
    localStorage.setItem("last_visit_date", today);
    return data.count || 0;
  } catch {
    return 0;
  }
};

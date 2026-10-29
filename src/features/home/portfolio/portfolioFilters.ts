import type { PortfolioItem } from "./portfolioData";

/** 공개 규칙: published 미정의/true = 공개, false만 비공개. */
export function isPublishedProject(project: PortfolioItem): boolean {
  return project.published !== false;
}

export interface PortfolioFilter {
  trade: string;
  clientType: string;
  query: string;
}

export const EMPTY_PORTFOLIO_FILTER: PortfolioFilter = {
  trade: "",
  clientType: "",
  query: "",
};

function normalize(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

/**
 * 목록 클라이언트 필터링 순수 함수 (추가 쿼리 없음).
 * - 비공개(published === false) 제외는 호출 전 isPublishedProject로 수행하거나
 *   여기서도 항상 제외한다.
 */
export function filterProjects(
  projects: PortfolioItem[],
  filter: PortfolioFilter,
): PortfolioItem[] {
  const trade = filter.trade.trim().toLowerCase();
  const clientType = filter.clientType.trim().toLowerCase();
  const query = filter.query.trim().toLowerCase();
  return projects.filter((project) => {
    if (!isPublishedProject(project)) return false;
    if (trade) {
      const projectTrade = normalize(project.trade);
      if (projectTrade !== trade) return false;
    }
    if (clientType) {
      const projectClientType = normalize(project.clientType);
      if (projectClientType !== clientType) return false;
    }
    if (query) {
      const haystack = [
        project.title,
        project.location,
        project.scope,
        project.result,
      ]
        .filter((entry): entry is string => typeof entry === "string")
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

/** 공종 필터 옵션: 값이 있는 것만, 가나다 순. */
export function getTradeOptions(projects: PortfolioItem[]): string[] {
  const values = new Set<string>();
  for (const project of projects) {
    const trade = project.trade?.trim();
    if (trade) values.add(trade);
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b, "ko"));
}

/** 발주처 유형 필터 옵션: 값이 있는 것만, 가나다 순. */
export function getClientTypeOptions(projects: PortfolioItem[]): string[] {
  const values = new Set<string>();
  for (const project of projects) {
    const clientType = project.clientType?.trim();
    if (clientType) values.add(clientType);
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b, "ko"));
}

export type TermLevel = '입문' | '중급' | '고급';

export type TermCategory =
  | '면적'
  | '가격'
  | '거래'
  | '임대'
  | '금융'
  | '청약'
  | '법'
  | '경매'
  | '정비사업'
  | '세금'
  | '플랫폼'
  | '규제';

export interface RealEstateGlossaryItem {
  id: string;
  term: string;
  aliases: string[];
  category: TermCategory;
  subcategory?: string;
  easy_def: string;
  analogy: string;
  example: string;
  note?: string;
  risk?: string;
  level: TermLevel;
  related_terms: string[];
  keywords: string[];
  is_slang: boolean;
}

import { StyleSheet } from "@react-pdf/renderer";

// 브랜드 색상
export const colors = {
  brand: {
    50: "#fef4f0",
    100: "#fde8e0",
    200: "#fad0c0",
    500: "#f07048",
    600: "#e85a30",
    700: "#c94a25",
    800: "#a13d1f",
    900: "#84331a",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};

// 회사소개서 (가로) 스타일
export const brochureStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    fontFamily: "NotoSansKR",
    padding: 40,
  },
  coverPage: {
    flexDirection: "column",
    backgroundColor: colors.brand[700],
    fontFamily: "NotoSansKR",
    padding: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 24,
    color: "#ffffff",
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: colors.brand[700],
    marginBottom: 24,
    borderBottomWidth: 3,
    borderBottomColor: colors.brand[500],
    paddingBottom: 12,
  },
  text: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 1.8,
    marginBottom: 12,
  },
  highlightBox: {
    backgroundColor: colors.brand[50],
    padding: 20,
    borderRadius: 8,
    marginVertical: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  column: {
    flex: 1,
    paddingHorizontal: 8,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: 16,
  },
  footerText: {
    fontSize: 10,
    color: colors.gray[400],
  },
  pageNumber: {
    fontSize: 12,
    color: colors.brand[700],
    fontWeight: 700,
  },
});

// 지명원 (세로) 스타일
export const nominationStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    fontFamily: "NotoSansKR",
    padding: 40,
    fontSize: 11,
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
  },
  documentTitle: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 8,
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.brand[700],
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    backgroundColor: colors.gray[100],
    padding: 8,
    marginTop: 20,
    marginBottom: 12,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[300],
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: colors.gray[100],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[300],
  },
  tableCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: colors.gray[300],
  },
  tableCellLast: {
    padding: 8,
  },
  tableHeaderText: {
    fontWeight: 700,
    fontSize: 10,
    textAlign: "center",
  },
  tableCellText: {
    fontSize: 10,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  infoLabel: {
    width: 120,
    fontWeight: 700,
    color: colors.gray[600],
  },
  infoValue: {
    flex: 1,
    color: colors.gray[800],
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: colors.gray[400],
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: 16,
  },
  seal: {
    position: "absolute",
    bottom: 80,
    right: 60,
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: colors.brand[700],
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sealText: {
    fontSize: 10,
    color: colors.brand[700],
    fontWeight: 700,
  },
});

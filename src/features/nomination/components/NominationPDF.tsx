"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Rect,
  Circle,
  Line,
  Path,
  Polygon,
} from "@react-pdf/renderer";
import { NominationData } from "../types";
import "@/shared/lib/pdf/fonts";

// Premium Canva-style color palette
const colors = {
  primary: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
  },
  navy: {
    50: "#f0f4f8",
    100: "#d9e2ec",
    200: "#bcccdc",
    300: "#9fb3c8",
    400: "#829ab1",
    500: "#627d98",
    600: "#486581",
    700: "#334e68",
    800: "#243b53",
    900: "#102a43",
  },
  gray: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },
  success: "#10b981",
  warning: "#f59e0b",
  info: "#3b82f6",
  danger: "#ef4444",
};

// Helper functions
const getExperienceColor = (years: number): string => {
  if (years >= 15) return colors.primary[600];
  if (years >= 10) return colors.info;
  if (years >= 5) return colors.success;
  return colors.warning;
};

const getCreditRatingColor = (grade: string): string => {
  if (grade.startsWith("A")) return colors.success;
  if (grade.startsWith("B")) return colors.info;
  if (grade.startsWith("C")) return colors.warning;
  return colors.gray[400];
};

interface NominationPDFProps {
  data: NominationData;
  companyName?: string;
  ceo?: string;
  address?: string;
  phone?: string;
  bizNum?: string;
}

export default function NominationPDF({
  data,
  companyName = "OJU CONSTRUCTION",
  ceo = "",
  address = "",
  phone = "",
  bizNum = "",
}: NominationPDFProps) {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate statistics
  const totalLicenses = data.licenses.length;
  const totalTechnicians = data.technicians.length;
  const totalEquipment = data.equipment.reduce((sum, e) => sum + e.quantity, 0);
  const avgExperience =
    totalTechnicians > 0
      ? Math.round(
          data.technicians.reduce((sum, t) => sum + t.experienceYears, 0) /
            totalTechnicians
        )
      : 0;

  // Experience distribution
  const seniorTechs = data.technicians.filter((t) => t.experienceYears >= 10).length;
  const midTechs = data.technicians.filter(
    (t) => t.experienceYears >= 5 && t.experienceYears < 10
  ).length;
  const juniorTechs = data.technicians.filter((t) => t.experienceYears < 5).length;

  return (
    <Document>
      {/* ================================================
          Page 1: Cover with Dashboard
          ================================================ */}
      <Page size="A4" style={{ fontFamily: "NotoSansKR", backgroundColor: "#ffffff" }}>
        {/* Header Section */}
        <View style={{
          backgroundColor: colors.navy[900],
          height: 180,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Background Pattern */}
          <Svg style={{ position: "absolute", width: "100%", height: "100%" }}>
            {/* Gradient layers */}
            <Rect x="0" y="0" width="595" height="60" fill={colors.primary[700]} opacity={0.15} />
            <Rect x="0" y="40" width="595" height="60" fill={colors.primary[600]} opacity={0.1} />

            {/* Geometric patterns */}
            <Polygon points="0,180 150,180 0,80" fill={colors.primary[600]} opacity={0.12} />
            <Polygon points="595,0 595,100 480,0" fill={colors.primary[500]} opacity={0.1} />

            {/* Decorative grid lines */}
            {[...Array(15)].map((_, i) => (
              <Line
                key={`grid-${i}`}
                x1={i * 45 - 50}
                y1="0"
                x2={i * 45 + 50}
                y2="180"
                stroke={colors.navy[700]}
                strokeWidth="0.5"
                opacity={0.4}
              />
            ))}

            {/* Accent dots */}
            {[...Array(8)].map((_, i) => (
              <Circle
                key={`dot-${i}`}
                cx={40 + i * 70}
                cy={160}
                r="3"
                fill={colors.primary[500]}
                opacity={0.5}
              />
            ))}
          </Svg>

          {/* Title */}
          <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}>
            <Text style={{
              fontSize: 42,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: 16,
            }}>
              지 명 원
            </Text>
            <Text style={{
              fontSize: 12,
              color: colors.primary[400],
              letterSpacing: 6,
              marginTop: 8,
            }}>
              NOMINATION DOCUMENT
            </Text>
          </View>

          {/* Bottom accent bar */}
          <View style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 5,
            backgroundColor: colors.primary[500],
          }} />
        </View>

        {/* Content Section */}
        <View style={{ padding: 35 }}>
          {/* Company Name & Date */}
          <View style={{ alignItems: "center", marginBottom: 25 }}>
            <Text style={{
              fontSize: 26,
              fontWeight: 700,
              color: colors.navy[900],
              letterSpacing: 2,
            }}>
              {companyName}
            </Text>
            <Text style={{
              fontSize: 11,
              color: colors.gray[500],
              marginTop: 8,
            }}>
              작성일: {today}
            </Text>
          </View>

          {/* Stats Dashboard */}
          <View style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 25,
          }}>
            {/* Licenses Card */}
            <View style={{
              flex: 1,
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 20,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.gray[200],
              borderTopWidth: 4,
              borderTopColor: colors.primary[500],
            }}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: colors.primary[100],
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}>
                <Svg width="24" height="24" viewBox="0 0 24 24">
                  <Rect x="4" y="2" width="16" height="20" rx="2" stroke={colors.primary[600]} strokeWidth="2" fill="none" />
                  <Line x1="8" y1="7" x2="16" y2="7" stroke={colors.primary[600]} strokeWidth="2" />
                  <Line x1="8" y1="11" x2="16" y2="11" stroke={colors.primary[600]} strokeWidth="2" />
                  <Line x1="8" y1="15" x2="12" y2="15" stroke={colors.primary[600]} strokeWidth="2" />
                </Svg>
              </View>
              <Text style={{
                fontSize: 32,
                fontWeight: 700,
                color: colors.navy[900],
              }}>
                {totalLicenses}
              </Text>
              <Text style={{
                fontSize: 11,
                color: colors.gray[500],
                marginTop: 4,
              }}>
                보유 면허
              </Text>
            </View>

            {/* Technicians Card */}
            <View style={{
              flex: 1,
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 20,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.gray[200],
              borderTopWidth: 4,
              borderTopColor: colors.info,
            }}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#dbeafe",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}>
                <Svg width="24" height="24" viewBox="0 0 24 24">
                  <Circle cx="12" cy="8" r="4" stroke={colors.info} strokeWidth="2" fill="none" />
                  <Path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={colors.info} strokeWidth="2" fill="none" />
                </Svg>
              </View>
              <Text style={{
                fontSize: 32,
                fontWeight: 700,
                color: colors.navy[900],
              }}>
                {totalTechnicians}
              </Text>
              <Text style={{
                fontSize: 11,
                color: colors.gray[500],
                marginTop: 4,
              }}>
                보유 기술자
              </Text>
            </View>

            {/* Equipment Card */}
            <View style={{
              flex: 1,
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 20,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.gray[200],
              borderTopWidth: 4,
              borderTopColor: colors.success,
            }}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#d1fae5",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}>
                <Svg width="24" height="24" viewBox="0 0 24 24">
                  <Rect x="3" y="8" width="18" height="10" rx="2" stroke={colors.success} strokeWidth="2" fill="none" />
                  <Circle cx="7" cy="20" r="2" stroke={colors.success} strokeWidth="2" fill="none" />
                  <Circle cx="17" cy="20" r="2" stroke={colors.success} strokeWidth="2" fill="none" />
                </Svg>
              </View>
              <Text style={{
                fontSize: 32,
                fontWeight: 700,
                color: colors.navy[900],
              }}>
                {totalEquipment}
              </Text>
              <Text style={{
                fontSize: 11,
                color: colors.gray[500],
                marginTop: 4,
              }}>
                보유 장비
              </Text>
            </View>

            {/* Credit Rating Card */}
            <View style={{
              flex: 1,
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 20,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.gray[200],
              borderTopWidth: 4,
              borderTopColor: colors.warning,
            }}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#fef3c7",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}>
                <Svg width="24" height="24" viewBox="0 0 24 24">
                  <Path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    stroke={colors.warning}
                    strokeWidth="2"
                    fill="none"
                  />
                </Svg>
              </View>
              <Text style={{
                fontSize: 32,
                fontWeight: 700,
                color: colors.navy[900],
              }}>
                {data.creditRating.grade || "-"}
              </Text>
              <Text style={{
                fontSize: 11,
                color: colors.gray[500],
                marginTop: 4,
              }}>
                신용등급
              </Text>
            </View>
          </View>

          {/* Company Info Section */}
          <View style={{
            backgroundColor: colors.gray[50],
            borderRadius: 12,
            padding: 22,
            marginBottom: 25,
            borderWidth: 1,
            borderColor: colors.gray[200],
          }}>
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 18,
              paddingBottom: 12,
              borderBottomWidth: 2,
              borderBottomColor: colors.primary[500],
            }}>
              <View style={{
                width: 4,
                height: 20,
                backgroundColor: colors.primary[500],
                marginRight: 10,
              }} />
              <Text style={{
                fontSize: 15,
                fontWeight: 700,
                color: colors.navy[900],
              }}>
                회사 기본정보
              </Text>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {[
                { label: "상호명", value: companyName },
                { label: "대표자", value: ceo || "-" },
                { label: "사업자번호", value: bizNum || "-" },
                { label: "연락처", value: phone || "-" },
                { label: "소재지", value: address || "-", fullWidth: true },
              ].map((item, index) => (
                <View
                  key={index}
                  style={{
                    width: item.fullWidth ? "100%" : "50%",
                    flexDirection: "row",
                    marginBottom: 10,
                    paddingRight: 10,
                  }}
                >
                  <Text style={{
                    width: 80,
                    fontSize: 10,
                    fontWeight: 700,
                    color: colors.gray[500],
                  }}>
                    {item.label}
                  </Text>
                  <Text style={{
                    flex: 1,
                    fontSize: 11,
                    color: colors.gray[800],
                  }}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Experience Distribution Chart */}
          {totalTechnicians > 0 && (
            <View style={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 22,
              borderWidth: 1,
              borderColor: colors.gray[200],
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: 700,
                color: colors.navy[900],
                marginBottom: 18,
              }}>
                기술자 경력 분포
              </Text>

              {[
                { label: "10년 이상", value: seniorTechs, color: colors.primary[500] },
                { label: "5-10년", value: midTechs, color: colors.info },
                { label: "5년 미만", value: juniorTechs, color: colors.success },
              ].map((item, index) => (
                <View key={index} style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}>
                  <Text style={{
                    width: 80,
                    fontSize: 10,
                    color: colors.gray[600],
                  }}>
                    {item.label}
                  </Text>
                  <View style={{
                    flex: 1,
                    height: 14,
                    backgroundColor: colors.gray[200],
                    borderRadius: 7,
                    marginHorizontal: 10,
                    overflow: "hidden",
                  }}>
                    <View style={{
                      width: `${(item.value / totalTechnicians) * 100}%`,
                      height: "100%",
                      backgroundColor: item.color,
                      borderRadius: 7,
                    }} />
                  </View>
                  <Text style={{
                    width: 40,
                    fontSize: 11,
                    fontWeight: 700,
                    color: colors.gray[700],
                    textAlign: "right",
                  }}>
                    {item.value}명
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={{
          position: "absolute",
          bottom: 25,
          left: 35,
          right: 35,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
          paddingTop: 12,
        }}>
          <Text style={{ fontSize: 9, color: colors.gray[400] }}>{companyName}</Text>
          <View style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: colors.primary[500],
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Text style={{ fontSize: 10, fontWeight: 700, color: "#ffffff" }}>1</Text>
          </View>
        </View>
      </Page>

      {/* ================================================
          Page 2: Licenses + Technicians
          ================================================ */}
      <Page size="A4" style={{ fontFamily: "NotoSansKR", backgroundColor: "#ffffff", padding: 35 }}>
        {/* Page Header */}
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
          paddingBottom: 15,
          borderBottomWidth: 2,
          borderBottomColor: colors.navy[900],
        }}>
          <View>
            <Text style={{
              fontSize: 20,
              fontWeight: 700,
              color: colors.navy[900],
            }}>
              면허 및 기술자 현황
            </Text>
            <Text style={{
              fontSize: 10,
              color: colors.gray[400],
              letterSpacing: 2,
              marginTop: 4,
            }}>
              LICENSE & TECHNICIAN STATUS
            </Text>
          </View>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.navy[900],
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Text style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>2</Text>
          </View>
        </View>

        {/* Licenses Section */}
        <View style={{ marginBottom: 25 }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}>
            <View style={{
              width: 4,
              height: 20,
              backgroundColor: colors.primary[500],
              marginRight: 10,
            }} />
            <Text style={{
              fontSize: 14,
              fontWeight: 700,
              color: colors.navy[900],
            }}>
              면허/등록 현황
            </Text>
          </View>

          {data.licenses.length > 0 ? (
            <View style={{
              borderRadius: 10,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.gray[200],
            }}>
              {/* Table Header */}
              <View style={{
                flexDirection: "row",
                backgroundColor: colors.navy[800],
              }}>
                {[
                  { label: "면허/등록명", flex: 2 },
                  { label: "등록번호", flex: 1.5 },
                  { label: "발급기관", flex: 1.5 },
                  { label: "취득일", flex: 1 },
                  { label: "만료일", flex: 1 },
                ].map((col, i) => (
                  <View key={i} style={{
                    flex: col.flex,
                    padding: 10,
                    borderRightWidth: i < 4 ? 1 : 0,
                    borderRightColor: colors.navy[700],
                  }}>
                    <Text style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#ffffff",
                      textAlign: "center",
                    }}>
                      {col.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Table Rows */}
              {data.licenses.map((license, index) => (
                <View
                  key={license.id}
                  style={{
                    flexDirection: "row",
                    backgroundColor: index % 2 === 0 ? "#ffffff" : colors.gray[50],
                    borderBottomWidth: index < data.licenses.length - 1 ? 1 : 0,
                    borderBottomColor: colors.gray[200],
                  }}
                >
                  <View style={{ flex: 2, padding: 10, borderRightWidth: 1, borderRightColor: colors.gray[200] }}>
                    <Text style={{ fontSize: 9, fontWeight: 700, color: colors.gray[800], textAlign: "center" }}>
                      {license.name}
                    </Text>
                  </View>
                  <View style={{ flex: 1.5, padding: 10, borderRightWidth: 1, borderRightColor: colors.gray[200] }}>
                    <Text style={{ fontSize: 9, color: colors.gray[600], textAlign: "center" }}>
                      {license.number}
                    </Text>
                  </View>
                  <View style={{ flex: 1.5, padding: 10, borderRightWidth: 1, borderRightColor: colors.gray[200] }}>
                    <Text style={{ fontSize: 9, color: colors.gray[600], textAlign: "center" }}>
                      {license.issuingAuthority}
                    </Text>
                  </View>
                  <View style={{ flex: 1, padding: 10, borderRightWidth: 1, borderRightColor: colors.gray[200] }}>
                    <Text style={{ fontSize: 9, color: colors.gray[600], textAlign: "center" }}>
                      {license.issueDate}
                    </Text>
                  </View>
                  <View style={{ flex: 1, padding: 10 }}>
                    <Text style={{ fontSize: 9, color: colors.gray[600], textAlign: "center" }}>
                      {license.expiryDate}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={{
              padding: 25,
              backgroundColor: colors.gray[50],
              borderRadius: 10,
              alignItems: "center",
            }}>
              <Text style={{ fontSize: 11, color: colors.gray[400] }}>
                등록된 면허가 없습니다
              </Text>
            </View>
          )}
        </View>

        {/* Technicians Section */}
        <View>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}>
            <View style={{
              width: 4,
              height: 20,
              backgroundColor: colors.info,
              marginRight: 10,
            }} />
            <Text style={{
              fontSize: 14,
              fontWeight: 700,
              color: colors.navy[900],
            }}>
              보유 기술자 현황
            </Text>
          </View>

          {data.technicians.length > 0 ? (
            <View style={{
              borderRadius: 10,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.gray[200],
            }}>
              {/* Table Header */}
              <View style={{
                flexDirection: "row",
                backgroundColor: colors.navy[800],
              }}>
                {[
                  { label: "성명", flex: 0.8 },
                  { label: "직위", flex: 0.8 },
                  { label: "자격/면허", flex: 1.5 },
                  { label: "자격번호", flex: 1.2 },
                  { label: "경력", flex: 1.5 },
                ].map((col, i) => (
                  <View key={i} style={{
                    flex: col.flex,
                    padding: 10,
                    borderRightWidth: i < 4 ? 1 : 0,
                    borderRightColor: colors.navy[700],
                  }}>
                    <Text style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#ffffff",
                      textAlign: "center",
                    }}>
                      {col.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Table Rows */}
              {data.technicians.map((tech, index) => (
                <View
                  key={tech.id}
                  style={{
                    flexDirection: "row",
                    backgroundColor: index % 2 === 0 ? "#ffffff" : colors.gray[50],
                    borderBottomWidth: index < data.technicians.length - 1 ? 1 : 0,
                    borderBottomColor: colors.gray[200],
                  }}
                >
                  <View style={{ flex: 0.8, padding: 10, borderRightWidth: 1, borderRightColor: colors.gray[200], justifyContent: "center" }}>
                    <Text style={{ fontSize: 9, fontWeight: 700, color: colors.gray[800], textAlign: "center" }}>
                      {tech.name}
                    </Text>
                  </View>
                  <View style={{ flex: 0.8, padding: 10, borderRightWidth: 1, borderRightColor: colors.gray[200], justifyContent: "center" }}>
                    <Text style={{ fontSize: 9, color: colors.gray[600], textAlign: "center" }}>
                      {tech.position}
                    </Text>
                  </View>
                  <View style={{ flex: 1.5, padding: 10, borderRightWidth: 1, borderRightColor: colors.gray[200], justifyContent: "center" }}>
                    <Text style={{ fontSize: 9, color: colors.gray[600], textAlign: "center" }}>
                      {tech.qualification}
                    </Text>
                  </View>
                  <View style={{ flex: 1.2, padding: 10, borderRightWidth: 1, borderRightColor: colors.gray[200], justifyContent: "center" }}>
                    <Text style={{ fontSize: 9, color: colors.gray[600], textAlign: "center" }}>
                      {tech.licenseNumber}
                    </Text>
                  </View>
                  <View style={{ flex: 1.5, padding: 10, justifyContent: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{
                        flex: 1,
                        height: 8,
                        backgroundColor: colors.gray[200],
                        borderRadius: 4,
                        overflow: "hidden",
                        marginRight: 8,
                      }}>
                        <View style={{
                          width: `${Math.min(tech.experienceYears * 5, 100)}%`,
                          height: "100%",
                          backgroundColor: getExperienceColor(tech.experienceYears),
                          borderRadius: 4,
                        }} />
                      </View>
                      <Text style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: colors.gray[700],
                        width: 28,
                        textAlign: "right",
                      }}>
                        {tech.experienceYears}년
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={{
              padding: 25,
              backgroundColor: colors.gray[50],
              borderRadius: 10,
              alignItems: "center",
            }}>
              <Text style={{ fontSize: 11, color: colors.gray[400] }}>
                등록된 기술자가 없습니다
              </Text>
            </View>
          )}

          {/* Average Experience Badge */}
          {totalTechnicians > 0 && (
            <View style={{
              marginTop: 12,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}>
              <Text style={{ fontSize: 10, color: colors.gray[500], marginRight: 10 }}>
                평균 경력:
              </Text>
              <View style={{
                backgroundColor: colors.navy[800],
                paddingVertical: 4,
                paddingHorizontal: 14,
                borderRadius: 12,
              }}>
                <Text style={{ fontSize: 10, fontWeight: 700, color: "#ffffff" }}>
                  {avgExperience}년
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={{
          position: "absolute",
          bottom: 25,
          left: 35,
          right: 35,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
          paddingTop: 12,
        }}>
          <Text style={{ fontSize: 9, color: colors.gray[400] }}>{companyName}</Text>
          <View style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: colors.primary[500],
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Text style={{ fontSize: 10, fontWeight: 700, color: "#ffffff" }}>2</Text>
          </View>
        </View>
      </Page>

      {/* ================================================
          Page 3: Equipment + Credit Rating
          ================================================ */}
      <Page size="A4" style={{ fontFamily: "NotoSansKR", backgroundColor: "#ffffff", padding: 35 }}>
        {/* Page Header */}
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
          paddingBottom: 15,
          borderBottomWidth: 2,
          borderBottomColor: colors.navy[900],
        }}>
          <View>
            <Text style={{
              fontSize: 20,
              fontWeight: 700,
              color: colors.navy[900],
            }}>
              장비 및 신용평가 현황
            </Text>
            <Text style={{
              fontSize: 10,
              color: colors.gray[400],
              letterSpacing: 2,
              marginTop: 4,
            }}>
              EQUIPMENT & CREDIT RATING STATUS
            </Text>
          </View>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.navy[900],
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Text style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>3</Text>
          </View>
        </View>

        {/* Equipment Section */}
        <View style={{ marginBottom: 25 }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}>
            <View style={{
              width: 4,
              height: 20,
              backgroundColor: colors.success,
              marginRight: 10,
            }} />
            <Text style={{
              fontSize: 14,
              fontWeight: 700,
              color: colors.navy[900],
            }}>
              보유 장비 현황
            </Text>
          </View>

          {data.equipment.length > 0 ? (
            <View style={{
              borderRadius: 10,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.gray[200],
            }}>
              {/* Table Header */}
              <View style={{
                flexDirection: "row",
                backgroundColor: colors.navy[800],
              }}>
                {[
                  { label: "장비명", flex: 1.5 },
                  { label: "모델/규격", flex: 1.5 },
                  { label: "수량", flex: 0.8 },
                  { label: "상태", flex: 1 },
                  { label: "등록번호", flex: 1.2 },
                ].map((col, i) => (
                  <View key={i} style={{
                    flex: col.flex,
                    padding: 10,
                    borderRightWidth: i < 4 ? 1 : 0,
                    borderRightColor: colors.navy[700],
                  }}>
                    <Text style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#ffffff",
                      textAlign: "center",
                    }}>
                      {col.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Table Rows */}
              {data.equipment.map((equip, index) => (
                <View
                  key={equip.id}
                  style={{
                    flexDirection: "row",
                    backgroundColor: index % 2 === 0 ? "#ffffff" : colors.gray[50],
                    borderBottomWidth: index < data.equipment.length - 1 ? 1 : 0,
                    borderBottomColor: colors.gray[200],
                  }}
                >
                  <View style={{ flex: 1.5, padding: 10, borderRightWidth: 1, borderRightColor: colors.gray[200], justifyContent: "center" }}>
                    <Text style={{ fontSize: 9, fontWeight: 700, color: colors.gray[800], textAlign: "center" }}>
                      {equip.name}
                    </Text>
                  </View>
                  <View style={{ flex: 1.5, padding: 10, borderRightWidth: 1, borderRightColor: colors.gray[200], justifyContent: "center" }}>
                    <Text style={{ fontSize: 9, color: colors.gray[600], textAlign: "center" }}>
                      {equip.model}
                    </Text>
                  </View>
                  <View style={{ flex: 0.8, padding: 10, borderRightWidth: 1, borderRightColor: colors.gray[200], justifyContent: "center", alignItems: "center" }}>
                    <View style={{
                      backgroundColor: colors.navy[800],
                      borderRadius: 10,
                      paddingVertical: 3,
                      paddingHorizontal: 10,
                    }}>
                      <Text style={{ fontSize: 9, fontWeight: 700, color: "#ffffff" }}>
                        {equip.quantity}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, padding: 10, borderRightWidth: 1, borderRightColor: colors.gray[200], justifyContent: "center", alignItems: "center" }}>
                    <View style={{
                      backgroundColor:
                        equip.condition === "양호" ? colors.success :
                        equip.condition === "보통" ? colors.warning : colors.gray[400],
                      borderRadius: 8,
                      paddingVertical: 3,
                      paddingHorizontal: 10,
                    }}>
                      <Text style={{ fontSize: 8, fontWeight: 700, color: "#ffffff" }}>
                        {equip.condition}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1.2, padding: 10, justifyContent: "center" }}>
                    <Text style={{ fontSize: 9, color: colors.gray[600], textAlign: "center" }}>
                      {equip.registrationNumber || "-"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={{
              padding: 25,
              backgroundColor: colors.gray[50],
              borderRadius: 10,
              alignItems: "center",
            }}>
              <Text style={{ fontSize: 11, color: colors.gray[400] }}>
                등록된 장비가 없습니다
              </Text>
            </View>
          )}

          {/* Equipment Total Badge */}
          {data.equipment.length > 0 && (
            <View style={{
              marginTop: 12,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}>
              <Text style={{ fontSize: 10, color: colors.gray[500], marginRight: 10 }}>
                총 장비 수:
              </Text>
              <View style={{
                backgroundColor: colors.success,
                paddingVertical: 4,
                paddingHorizontal: 14,
                borderRadius: 12,
              }}>
                <Text style={{ fontSize: 10, fontWeight: 700, color: "#ffffff" }}>
                  {totalEquipment}대
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Credit Rating Section */}
        <View style={{ marginBottom: 30 }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}>
            <View style={{
              width: 4,
              height: 20,
              backgroundColor: colors.warning,
              marginRight: 10,
            }} />
            <Text style={{
              fontSize: 14,
              fontWeight: 700,
              color: colors.navy[900],
            }}>
              신용평가등급
            </Text>
          </View>

          <View style={{
            backgroundColor: colors.gray[50],
            borderRadius: 12,
            padding: 25,
            borderWidth: 1,
            borderColor: colors.gray[200],
          }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Credit Grade Circle */}
              <View style={{ alignItems: "center", marginRight: 35 }}>
                <View style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor: data.creditRating.grade
                    ? getCreditRatingColor(data.creditRating.grade)
                    : colors.gray[400],
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                }}>
                  <Text style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#ffffff",
                  }}>
                    {data.creditRating.grade || "-"}
                  </Text>
                </View>
                <Text style={{ fontSize: 11, color: colors.gray[600] }}>신용등급</Text>
              </View>

              {/* Credit Info Grid */}
              <View style={{ flex: 1 }}>
                {[
                  { label: "평가기관", value: data.creditRating.agency || "-" },
                  { label: "평가일", value: data.creditRating.evaluationDate || "-" },
                  { label: "유효기간", value: data.creditRating.validUntil || "-" },
                ].map((item, index) => (
                  <View key={index} style={{
                    flexDirection: "row",
                    paddingVertical: 10,
                    borderBottomWidth: index < 2 ? 1 : 0,
                    borderBottomColor: colors.gray[200],
                  }}>
                    <Text style={{
                      width: 80,
                      fontSize: 11,
                      fontWeight: 700,
                      color: colors.gray[500],
                    }}>
                      {item.label}
                    </Text>
                    <Text style={{
                      flex: 1,
                      fontSize: 11,
                      color: colors.gray[800],
                    }}>
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Rating Scale */}
            <View style={{ marginTop: 20 }}>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
              }}>
                {["D", "C", "B", "A", "AAA"].map((grade, i) => (
                  <Text key={i} style={{ fontSize: 8, color: colors.gray[500] }}>{grade}</Text>
                ))}
              </View>
              <View style={{
                height: 10,
                borderRadius: 5,
                flexDirection: "row",
                overflow: "hidden",
              }}>
                <View style={{ flex: 1, backgroundColor: colors.gray[400] }} />
                <View style={{ flex: 1, backgroundColor: colors.warning }} />
                <View style={{ flex: 1, backgroundColor: colors.info }} />
                <View style={{ flex: 1, backgroundColor: colors.success }} />
                <View style={{ flex: 1, backgroundColor: colors.primary[500] }} />
              </View>
            </View>
          </View>
        </View>

        {/* Certification Statement */}
        <View style={{
          backgroundColor: colors.navy[50],
          borderRadius: 12,
          padding: 25,
          borderWidth: 1,
          borderColor: colors.navy[200],
        }}>
          <Text style={{
            fontSize: 12,
            color: colors.gray[700],
            textAlign: "center",
            lineHeight: 1.8,
          }}>
            본 지명원에 기재된 내용은 사실과 다름이 없음을 확인합니다.
          </Text>
          <Text style={{
            fontSize: 11,
            color: colors.gray[500],
            textAlign: "center",
            marginTop: 10,
          }}>
            {today}
          </Text>
        </View>

        {/* Seal */}
        <View style={{
          position: "absolute",
          bottom: 90,
          right: 50,
          alignItems: "center",
        }}>
          <View style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            borderWidth: 2,
            borderColor: colors.primary[600],
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Svg width="50" height="50" viewBox="0 0 50 50">
              <Circle cx="25" cy="25" r="22" stroke={colors.primary[600]} strokeWidth="1" fill="none" />
              <Circle cx="25" cy="25" r="17" stroke={colors.primary[600]} strokeWidth="0.5" fill="none" />
            </Svg>
            <Text style={{
              position: "absolute",
              fontSize: 12,
              fontWeight: 700,
              color: colors.primary[600],
            }}>
              (인)
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={{
          position: "absolute",
          bottom: 25,
          left: 35,
          right: 35,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
          paddingTop: 12,
        }}>
          <Text style={{ fontSize: 9, color: colors.gray[400] }}>{companyName}</Text>
          <View style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: colors.primary[500],
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Text style={{ fontSize: 10, fontWeight: 700, color: "#ffffff" }}>3</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

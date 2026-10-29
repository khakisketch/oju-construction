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
  Image,
  Defs,
  LinearGradient,
  Stop,
} from "@react-pdf/renderer";
import { BrochureData, CoverStyle } from "../types";
import "@/shared/lib/pdf/fonts";
import QRCode from "qrcode";

// Premium Canva-style color palette
const colors = {
  // Primary brand colors
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
  // Navy/Dark blues for professional look
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
  // Neutral grays
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
  // Accent colors
  accent: {
    teal: "#0d9488",
    blue: "#3b82f6",
    purple: "#8b5cf6",
    rose: "#f43f5e",
  },
};

const pageWidth = 842;
const pageHeight = 595;

// ============================================
// Cover Style 1: Modern Geometric
// ============================================
const GeometricCover = ({ companyName, tagline }: { companyName: string; tagline: string }) => (
  <Page size="A4" orientation="landscape" style={{ fontFamily: "NotoSansKR" }}>
    <View style={{ flex: 1, backgroundColor: colors.navy[900], position: "relative" }}>
      {/* Background patterns */}
      <Svg style={{ position: "absolute", width: "100%", height: "100%" }}>
        {/* Large decorative circle */}
        <Circle cx="700" cy="500" r="300" fill={colors.primary[600]} opacity={0.08} />
        <Circle cx="720" cy="520" r="250" fill={colors.primary[500]} opacity={0.05} />

        {/* Geometric shapes */}
        <Polygon points="0,595 300,595 0,350" fill={colors.primary[600]} opacity={0.15} />
        <Polygon points="842,0 842,200 650,0" fill={colors.navy[700]} opacity={0.4} />

        {/* Grid lines for depth */}
        {[...Array(6)].map((_, i) => (
          <Line key={`grid-h-${i}`} x1="0" y1={100 + i * 100} x2="842" y2={100 + i * 100} stroke={colors.navy[700]} strokeWidth="0.5" opacity={0.3} />
        ))}
        {[...Array(8)].map((_, i) => (
          <Line key={`grid-v-${i}`} x1={100 + i * 100} y1="0" x2={100 + i * 100} y2="595" stroke={colors.navy[700]} strokeWidth="0.5" opacity={0.3} />
        ))}

        {/* Accent shapes */}
        <Rect x="60" y="60" width="80" height="4" fill={colors.primary[500]} />
        <Rect x="60" y="70" width="40" height="4" fill={colors.primary[400]} opacity={0.6} />

        {/* Corner accent */}
        <Rect x="782" y="535" width="40" height="40" fill={colors.primary[500]} opacity={0.3} />
        <Rect x="752" y="565" width="30" height="30" fill={colors.primary[600]} opacity={0.2} />
      </Svg>

      {/* Main content */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 60 }}>
        {/* Company name */}
        <Text style={{
          fontSize: 64,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: 8,
          marginBottom: 16,
        }}>
          {companyName}
        </Text>

        {/* Divider */}
        <View style={{
          width: 120,
          height: 4,
          backgroundColor: colors.primary[500],
          marginVertical: 24,
        }} />

        {/* Document type */}
        <Text style={{
          fontSize: 24,
          fontWeight: 300,
          color: "#ffffff",
          letterSpacing: 12,
          opacity: 0.9,
          marginBottom: 16,
        }}>
          COMPANY PROFILE
        </Text>

        {/* Tagline */}
        <Text style={{
          fontSize: 16,
          color: colors.primary[400],
          letterSpacing: 2,
          marginTop: 40,
        }}>
          {tagline}
        </Text>
      </View>

      {/* Bottom bar */}
      <View style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 6,
        backgroundColor: colors.primary[500],
      }} />
    </View>
  </Page>
);

// ============================================
// Cover Style 2: Elegant Gradient
// ============================================
const GradientCover = ({ companyName, tagline }: { companyName: string; tagline: string }) => (
  <Page size="A4" orientation="landscape" style={{ fontFamily: "NotoSansKR" }}>
    <View style={{ flex: 1, backgroundColor: colors.navy[900], position: "relative" }}>
      {/* Gradient simulation layers */}
      <Svg style={{ position: "absolute", width: "100%", height: "100%" }}>
        {/* Gradient background strips */}
        <Rect x="0" y="0" width="842" height="150" fill={colors.primary[700]} opacity={0.25} />
        <Rect x="0" y="100" width="842" height="150" fill={colors.primary[600]} opacity={0.2} />
        <Rect x="0" y="200" width="842" height="150" fill={colors.primary[500]} opacity={0.15} />

        {/* Diagonal gradient effect */}
        <Polygon points="0,0 600,0 0,595" fill={colors.navy[800]} opacity={0.5} />
        <Polygon points="842,595 842,100 300,595" fill={colors.primary[600]} opacity={0.12} />

        {/* Decorative curves */}
        <Path d="M 0 400 Q 200 300 400 400 T 800 400" stroke={colors.primary[500]} strokeWidth="2" fill="none" opacity={0.2} />
        <Path d="M 0 450 Q 250 350 500 450 T 850 450" stroke={colors.primary[400]} strokeWidth="1" fill="none" opacity={0.15} />

        {/* Floating circles */}
        <Circle cx="750" cy="150" r="80" fill={colors.primary[500]} opacity={0.08} />
        <Circle cx="780" cy="180" r="60" fill={colors.primary[400]} opacity={0.06} />
        <Circle cx="100" cy="500" r="120" fill={colors.navy[700]} opacity={0.4} />
      </Svg>

      {/* Content - Left aligned */}
      <View style={{ flex: 1, justifyContent: "center", paddingLeft: 100, paddingRight: 200 }}>
        {/* Accent bar */}
        <View style={{
          width: 6,
          height: 80,
          backgroundColor: colors.primary[500],
          marginBottom: 30,
        }} />

        {/* Company name */}
        <Text style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: 4,
          marginBottom: 8,
        }}>
          {companyName}
        </Text>

        {/* Subtitle */}
        <Text style={{
          fontSize: 20,
          fontWeight: 300,
          color: "#ffffff",
          letterSpacing: 8,
          opacity: 0.85,
          marginTop: 16,
        }}>
          COMPANY PROFILE
        </Text>

        {/* Tagline */}
        <View style={{ marginTop: 50, maxWidth: 400 }}>
          <Text style={{
            fontSize: 15,
            color: colors.primary[300],
            lineHeight: 1.8,
            letterSpacing: 1,
          }}>
            {tagline}
          </Text>
        </View>
      </View>

      {/* Bottom info */}
      <View style={{ position: "absolute", bottom: 40, right: 60, alignItems: "flex-end" }}>
        <Text style={{ fontSize: 11, color: "#ffffff", opacity: 0.5 }}>
          {new Date().getFullYear()}
        </Text>
      </View>
    </View>
  </Page>
);

// ============================================
// Cover Style 3: Clean Lines
// ============================================
const LinesCover = ({ companyName, tagline }: { companyName: string; tagline: string }) => (
  <Page size="A4" orientation="landscape" style={{ fontFamily: "NotoSansKR" }}>
    <View style={{ flex: 1, backgroundColor: "#ffffff", position: "relative" }}>
      {/* Structural line pattern */}
      <Svg style={{ position: "absolute", width: "100%", height: "100%" }}>
        {/* Horizontal grid */}
        {[80, 120, 160, 480, 520].map((y, i) => (
          <Line key={`h-${i}`} x1="0" y1={y} x2="842" y2={y} stroke={colors.gray[200]} strokeWidth="1" />
        ))}
        {/* Vertical grid */}
        {[60, 100, 742, 782].map((x, i) => (
          <Line key={`v-${i}`} x1={x} y1="0" x2={x} y2="595" stroke={colors.gray[200]} strokeWidth="1" />
        ))}

        {/* Accent diagonals */}
        <Line x1="0" y1="595" x2="250" y2="400" stroke={colors.primary[600]} strokeWidth="4" />
        <Line x1="0" y1="595" x2="300" y2="420" stroke={colors.primary[500]} strokeWidth="2" opacity={0.6} />
        <Line x1="600" y1="0" x2="842" y2="180" stroke={colors.primary[600]} strokeWidth="4" />
        <Line x1="650" y1="0" x2="842" y2="140" stroke={colors.primary[500]} strokeWidth="2" opacity={0.6} />

        {/* Corner squares */}
        <Rect x="742" y="80" width="40" height="40" fill={colors.primary[500]} opacity={0.1} />
        <Rect x="60" y="480" width="40" height="40" fill={colors.primary[500]} opacity={0.1} />
      </Svg>

      {/* Left accent bar */}
      <View style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 10,
        backgroundColor: colors.primary[600],
      }} />

      {/* Main content */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* Document type label */}
        <Text style={{
          fontSize: 13,
          fontWeight: 700,
          color: colors.primary[600],
          letterSpacing: 8,
          marginBottom: 20,
        }}>
          COMPANY PROFILE
        </Text>

        {/* Company name */}
        <Text style={{
          fontSize: 60,
          fontWeight: 700,
          color: colors.navy[900],
          letterSpacing: 6,
        }}>
          {companyName}
        </Text>

        {/* Divider */}
        <View style={{
          width: 100,
          height: 5,
          backgroundColor: colors.primary[600],
          marginVertical: 28,
        }} />

        {/* Tagline */}
        <Text style={{
          fontSize: 16,
          color: colors.gray[600],
          letterSpacing: 2,
        }}>
          {tagline}
        </Text>
      </View>

      {/* Footer info */}
      <View style={{
        position: "absolute",
        bottom: 35,
        left: 60,
        right: 60,
        flexDirection: "row",
        justifyContent: "space-between",
      }}>
        <Text style={{ fontSize: 10, color: colors.gray[400] }}>회사소개서</Text>
        <Text style={{ fontSize: 10, color: colors.gray[400] }}>{new Date().getFullYear()}</Text>
      </View>
    </View>
  </Page>
);

// ============================================
// Cover Style 4: Photo Style
// ============================================
const PhotoCover = ({ companyName, tagline }: { companyName: string; tagline: string }) => (
  <Page size="A4" orientation="landscape" style={{ fontFamily: "NotoSansKR" }}>
    <View style={{ flex: 1, backgroundColor: colors.gray[900], position: "relative" }}>
      {/* Simulated photo background with building silhouettes */}
      <Svg style={{ position: "absolute", width: "100%", height: "100%" }}>
        {/* Sky gradient simulation */}
        <Rect x="0" y="0" width="842" height="200" fill={colors.navy[700]} />
        <Rect x="0" y="150" width="842" height="100" fill={colors.navy[800]} />

        {/* Building silhouettes */}
        <Rect x="50" y="180" width="100" height="415" fill={colors.gray[800]} />
        <Rect x="170" y="120" width="120" height="475" fill={colors.gray[700]} />
        <Rect x="310" y="80" width="140" height="515" fill={colors.gray[800]} />
        <Rect x="470" y="150" width="110" height="445" fill={colors.gray[700]} />
        <Rect x="600" y="200" width="130" height="395" fill={colors.gray[800]} />
        <Rect x="750" y="160" width="92" height="435" fill={colors.gray[700]} />

        {/* Crane silhouette */}
        <Rect x="280" y="30" width="8" height="500" fill={colors.gray[600]} />
        <Rect x="180" y="30" width="200" height="8" fill={colors.gray[600]} />
        <Line x1="288" y1="38" x2="180" y2="180" stroke={colors.gray[600]} strokeWidth="3" />

        {/* Window lights on buildings */}
        {[...Array(8)].map((_, row) => (
          [...Array(4)].map((_, col) => (
            <Rect key={`w1-${row}-${col}`} x={180 + col * 25} y={140 + row * 50} width="15" height="20" fill={colors.primary[400]} opacity={0.3} />
          ))
        ))}
      </Svg>

      {/* Dark overlay */}
      <View style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
      }} />

      {/* Top accent bar */}
      <View style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 8,
        backgroundColor: colors.primary[500],
      }} />

      {/* Content */}
      <View style={{ flex: 1, justifyContent: "center", paddingLeft: 80 }}>
        {/* Label */}
        <Text style={{
          fontSize: 12,
          fontWeight: 700,
          color: colors.primary[400],
          letterSpacing: 6,
          marginBottom: 20,
        }}>
          COMPANY PROFILE
        </Text>

        {/* Company name */}
        <Text style={{
          fontSize: 58,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: 4,
          marginBottom: 8,
        }}>
          {companyName}
        </Text>

        {/* Divider */}
        <View style={{
          width: 80,
          height: 5,
          backgroundColor: colors.primary[500],
          marginVertical: 24,
        }} />

        {/* Tagline */}
        <Text style={{
          fontSize: 18,
          color: "#ffffff",
          opacity: 0.9,
          letterSpacing: 2,
        }}>
          {tagline}
        </Text>
      </View>

      {/* Bottom right info */}
      <View style={{ position: "absolute", bottom: 40, right: 50, alignItems: "flex-end" }}>
        <Text style={{ fontSize: 11, color: "#ffffff", opacity: 0.5 }}>
          회사소개서 {new Date().getFullYear()}
        </Text>
      </View>
    </View>
  </Page>
);

// ============================================
// Section Header Component
// ============================================
const SectionHeader = ({ title, subtitle, marginBottom = 35 }: { title: string; subtitle?: string; marginBottom?: number }) => (
  <View style={{ marginBottom }}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{
        width: 5,
        height: 32,
        backgroundColor: colors.primary[500],
        marginRight: 16,
      }} />
      <View>
        <Text style={{
          fontSize: 28,
          fontWeight: 700,
          color: colors.navy[900],
          letterSpacing: 1,
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{
            fontSize: 11,
            color: colors.gray[400],
            letterSpacing: 3,
            marginTop: 4,
          }}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  </View>
);

// ============================================
// Page Footer Component
// ============================================
const PageFooter = ({ pageNumber, companyName }: { pageNumber: number; companyName: string }) => (
  <View style={{
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: 15,
  }}>
    <Text style={{ fontSize: 9, color: colors.gray[400], letterSpacing: 1 }}>{companyName}</Text>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary[500],
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text style={{ fontSize: 11, fontWeight: 700, color: "#ffffff" }}>{pageNumber}</Text>
      </View>
    </View>
  </View>
);

// ============================================
// Vision & Mission Page
// ============================================
const VisionMissionPage = ({ data, companyName }: { data: BrochureData; companyName: string }) => (
  <Page size="A4" orientation="landscape" style={{ fontFamily: "NotoSansKR", padding: 50, paddingBottom: 70 }}>
    <SectionHeader title="비전 & 미션" subtitle="VISION & MISSION" marginBottom={24} />

    <View style={{ flexDirection: "row", gap: 24, marginBottom: 28 }}>
      {/* Vision Card */}
      <View style={{
        flex: 1,
        backgroundColor: colors.primary[50],
        borderRadius: 12,
        padding: 25,
        borderLeftWidth: 5,
        borderLeftColor: colors.primary[500],
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.primary[500],
            justifyContent: "center",
            alignItems: "center",
            marginRight: 14,
          }}>
            <Svg width="24" height="24" viewBox="0 0 24 24">
              <Circle cx="12" cy="12" r="9" stroke="#ffffff" strokeWidth="2" fill="none" />
              <Circle cx="12" cy="12" r="5" stroke="#ffffff" strokeWidth="2" fill="none" />
              <Circle cx="12" cy="12" r="2" fill="#ffffff" />
            </Svg>
          </View>
          <View>
            <Text style={{ fontSize: 18, fontWeight: 700, color: colors.primary[700] }}>비전</Text>
            <Text style={{ fontSize: 10, color: colors.primary[500], letterSpacing: 2 }}>VISION</Text>
          </View>
        </View>
        <Text style={{ fontSize: 15, color: colors.gray[700], lineHeight: 1.9 }}>
          {data.vision}
        </Text>
      </View>

      {/* Mission Card */}
      <View style={{
        flex: 1,
        backgroundColor: colors.navy[50],
        borderRadius: 12,
        padding: 25,
        borderLeftWidth: 5,
        borderLeftColor: colors.navy[700],
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.navy[700],
            justifyContent: "center",
            alignItems: "center",
            marginRight: 14,
          }}>
            <Svg width="24" height="24" viewBox="0 0 24 24">
              <Path d="M12 2L2 7l10 5 10-5-10-5z" fill="#ffffff" />
              <Path d="M2 17l10 5 10-5" stroke="#ffffff" strokeWidth="2" fill="none" />
              <Path d="M2 12l10 5 10-5" stroke="#ffffff" strokeWidth="2" fill="none" />
            </Svg>
          </View>
          <View>
            <Text style={{ fontSize: 18, fontWeight: 700, color: colors.navy[800] }}>미션</Text>
            <Text style={{ fontSize: 10, color: colors.navy[600], letterSpacing: 2 }}>MISSION</Text>
          </View>
        </View>
        <Text style={{ fontSize: 15, color: colors.gray[700], lineHeight: 1.9 }}>
          {data.mission}
        </Text>
      </View>
    </View>

    {/* Core Values */}
    {data.coreValues.length > 0 && (
      <View>
        <Text style={{
          fontSize: 14,
          fontWeight: 700,
          color: colors.navy[800],
          marginBottom: 14,
          letterSpacing: 1,
        }}>
          핵심 가치 CORE VALUES
        </Text>
        <View style={{ flexDirection: "row", gap: 16 }}>
          {data.coreValues.slice(0, 4).map((value, index) => (
            <View key={index} style={{
              flex: 1,
              backgroundColor: colors.navy[800],
              borderRadius: 12,
              padding: 20,
              alignItems: "center",
            }}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: colors.primary[500],
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 14,
              }}>
                <Text style={{ fontSize: 20, fontWeight: 700, color: "#ffffff" }}>{index + 1}</Text>
              </View>
              <Text style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: 8,
                textAlign: "center",
              }}>
                {value.title}
              </Text>
              <Text style={{
                fontSize: 10,
                color: "#ffffff",
                opacity: 0.8,
                textAlign: "center",
                lineHeight: 1.5,
              }}>
                {value.description}
              </Text>
            </View>
          ))}
        </View>
      </View>
    )}

    <PageFooter pageNumber={2} companyName={companyName} />
  </Page>
);

// ============================================
// Business Areas Page
// ============================================
const BusinessAreasPage = ({ data, companyName }: { data: BrochureData; companyName: string }) => (
  <Page size="A4" orientation="landscape" style={{ fontFamily: "NotoSansKR", padding: 50, paddingBottom: 70 }}>
    <SectionHeader title="사업 영역" subtitle="BUSINESS AREAS" />

    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 18 }}>
      {data.businessAreas.map((area, index) => (
        <View key={area.id} style={{
          width: "48%",
          backgroundColor: "#ffffff",
          borderRadius: 12,
          padding: 22,
          borderWidth: 1,
          borderColor: colors.gray[200],
          flexDirection: "row",
        }}>
          <View style={{
            width: 56,
            height: 56,
            backgroundColor: colors.primary[500],
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 18,
          }}>
            <Text style={{ fontSize: 22, fontWeight: 700, color: "#ffffff" }}>
              {String(index + 1).padStart(2, "0")}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 17,
              fontWeight: 700,
              color: colors.navy[900],
              marginBottom: 8,
            }}>
              {area.title}
            </Text>
            <Text style={{
              fontSize: 11,
              color: colors.gray[600],
              lineHeight: 1.7,
            }}>
              {area.description}
            </Text>
          </View>
        </View>
      ))}
    </View>

    <PageFooter pageNumber={3} companyName={companyName} />
  </Page>
);

// ============================================
// History Page
// ============================================
const HistoryPage = ({ data, companyName }: { data: BrochureData; companyName: string }) => {
  const sortedHistory = [...data.history].sort((a, b) => parseInt(b.year) - parseInt(a.year));

  return (
    <Page size="A4" orientation="landscape" style={{ fontFamily: "NotoSansKR", padding: 50, paddingBottom: 70 }}>
      <SectionHeader title="회사 연혁" subtitle="COMPANY HISTORY" />

      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "100%" }}>
          {sortedHistory.map((item, index) => (
            <View key={index} style={{ flexDirection: "row", marginBottom: 20 }}>
              {/* Year */}
              <View style={{ width: 90, alignItems: "flex-end", paddingRight: 24 }}>
                <Text style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.primary[600],
                }}>
                  {item.year}
                </Text>
              </View>

              {/* Timeline dot and line */}
              <View style={{ alignItems: "center", width: 24 }}>
                <View style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: colors.primary[500],
                  borderWidth: 3,
                  borderColor: colors.primary[200],
                }} />
                {index < sortedHistory.length - 1 && (
                  <View style={{
                    width: 2,
                    flex: 1,
                    backgroundColor: colors.gray[200],
                    marginTop: 6,
                  }} />
                )}
              </View>

              {/* Events */}
              <View style={{
                flex: 1,
                paddingLeft: 24,
                paddingBottom: 10,
                backgroundColor: colors.gray[50],
                borderRadius: 10,
                padding: 16,
                marginLeft: 8,
              }}>
                {item.events.map((event, eventIndex) => (
                  <View key={eventIndex} style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: eventIndex < item.events.length - 1 ? 8 : 0,
                  }}>
                    <View style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.primary[400],
                      marginRight: 12,
                      marginTop: 5,
                    }} />
                    <Text style={{
                      fontSize: 12,
                      color: colors.gray[700],
                      flex: 1,
                      lineHeight: 1.5,
                    }}>
                      {event}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      <PageFooter pageNumber={4} companyName={companyName} />
    </Page>
  );
};

// ============================================
// Organization Page
// ============================================
const OrganizationPage = ({ data, companyName }: { data: BrochureData; companyName: string }) => (
  <Page size="A4" orientation="landscape" style={{ fontFamily: "NotoSansKR", padding: 50, paddingBottom: 70 }}>
    <SectionHeader title="조직도" subtitle="ORGANIZATION" />

    <View style={{ alignItems: "center", paddingTop: 30 }}>
      {/* CEO */}
      <View style={{
        backgroundColor: colors.primary[500],
        paddingVertical: 18,
        paddingHorizontal: 50,
        borderRadius: 12,
        marginBottom: 8,
      }}>
        <Text style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", textAlign: "center" }}>
          대표이사
        </Text>
        <Text style={{ fontSize: 10, color: "#ffffff", opacity: 0.8, textAlign: "center", marginTop: 4 }}>
          CEO
        </Text>
      </View>

      {/* Connecting line */}
      <View style={{ width: 2, height: 25, backgroundColor: colors.gray[300] }} />

      {/* Departments */}
      <View style={{ flexDirection: "row", gap: 50, marginTop: 8 }}>
        {["경영지원본부", "기술본부", "사업본부", "안전관리본부"].map((dept, index) => (
          <View key={index} style={{ alignItems: "center" }}>
            {/* Connecting line to top */}
            <View style={{ width: 2, height: 20, backgroundColor: colors.gray[300], marginBottom: 8 }} />

            {/* Department box */}
            <View style={{
              backgroundColor: colors.navy[800],
              paddingVertical: 14,
              paddingHorizontal: 28,
              borderRadius: 10,
            }}>
              <Text style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", textAlign: "center" }}>
                {dept}
              </Text>
            </View>

            {/* Sub-teams */}
            <View style={{ marginTop: 16 }}>
              {["팀 1", "팀 2"].map((team, teamIndex) => (
                <View key={teamIndex} style={{
                  backgroundColor: colors.gray[100],
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  marginBottom: 10,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.primary[400],
                }}>
                  <Text style={{ fontSize: 11, color: colors.gray[700] }}>
                    {dept.replace("본부", "")} {team}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>

    <PageFooter pageNumber={5} companyName={companyName} />
  </Page>
);

// ============================================
// Certifications Page
// ============================================
const CertificationsPage = ({ data, companyName }: { data: BrochureData; companyName: string }) => (
  <Page size="A4" orientation="landscape" style={{ fontFamily: "NotoSansKR", padding: 50, paddingBottom: 70 }}>
    <SectionHeader title="인증서 & 자격증" subtitle="CERTIFICATIONS" />

    {data.certifications.length > 0 ? (
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 18 }}>
        {data.certifications.map((cert, index) => (
          <View key={index} style={{
            width: "31%",
            backgroundColor: "#ffffff",
            borderRadius: 12,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.gray[200],
            borderTopWidth: 4,
            borderTopColor: colors.primary[500],
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.primary[100],
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 14,
            }}>
              <Svg width="20" height="20" viewBox="0 0 20 20">
                <Path
                  d="M10 1L12.39 6.36L18 7.27L14 11.14L15 17L10 14.27L5 17L6 11.14L2 7.27L7.61 6.36L10 1Z"
                  fill={colors.primary[500]}
                />
              </Svg>
            </View>
            <Text style={{
              fontSize: 14,
              fontWeight: 700,
              color: colors.navy[900],
              marginBottom: 10,
            }}>
              {cert.name}
            </Text>
            <Text style={{ fontSize: 11, color: colors.gray[500], marginBottom: 6 }}>
              {cert.issuer}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.primary[400],
                marginRight: 8,
              }} />
              <Text style={{ fontSize: 11, color: colors.primary[600] }}>
                {cert.date}
              </Text>
            </View>
          </View>
        ))}
      </View>
    ) : (
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.gray[50],
        borderRadius: 12,
      }}>
        <Text style={{ fontSize: 15, color: colors.gray[400] }}>
          등록된 인증서가 없습니다
        </Text>
      </View>
    )}

    <PageFooter pageNumber={6} companyName={companyName} />
  </Page>
);

// ============================================
// Contact Page
// ============================================
const ContactPage = ({
  companyName,
  companyInfo,
  websiteUrl,
  qrCodeDataUrl,
}: {
  companyName: string;
  companyInfo: { address: string; phone: string; email: string; fax: string };
  websiteUrl: string;
  qrCodeDataUrl?: string;
}) => (
  <Page size="A4" orientation="landscape" style={{ fontFamily: "NotoSansKR" }}>
    <View style={{ flex: 1, backgroundColor: colors.navy[900], position: "relative" }}>
      {/* Background decoration */}
      <Svg style={{ position: "absolute", width: "100%", height: "100%" }}>
        {/* Circles */}
        <Circle cx="750" cy="500" r="200" fill={colors.primary[600]} opacity={0.08} />
        <Circle cx="780" cy="530" r="150" fill={colors.primary[500]} opacity={0.05} />
        <Circle cx="100" cy="100" r="100" fill={colors.navy[700]} opacity={0.5} />

        {/* Corner accents */}
        <Polygon points="0,595 200,595 0,450" fill={colors.primary[600]} opacity={0.12} />
        <Polygon points="842,0 842,150 700,0" fill={colors.primary[500]} opacity={0.1} />

        {/* Subtle grid */}
        {[...Array(5)].map((_, i) => (
          <Line key={`grid-${i}`} x1="0" y1={120 + i * 100} x2="842" y2={120 + i * 100} stroke={colors.navy[700]} strokeWidth="0.5" opacity={0.3} />
        ))}
      </Svg>

      {/* Main content */}
      <View style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}>
        {/* Contact info */}
        <View style={{ flex: 1, alignItems: "center" }}>
          {/* Company name */}
          <Text style={{
            fontSize: 42,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 3,
            marginBottom: 8,
          }}>
            {companyName}
          </Text>

          {/* Divider */}
          <View style={{
            width: 80,
            height: 4,
            backgroundColor: colors.primary[500],
            marginVertical: 25,
          }} />

          {/* Contact details */}
          <View style={{ alignItems: "center", gap: 14 }}>
            {companyInfo.address && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.primary[500],
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 14,
                }}>
                  <Svg width="16" height="16" viewBox="0 0 16 16">
                    <Path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 7.5c-1.38 0-2.5-1.12-2.5-2.5S6.62 3.5 8 3.5s2.5 1.12 2.5 2.5S9.38 8.5 8 8.5z" fill="#ffffff" />
                  </Svg>
                </View>
                <Text style={{ fontSize: 13, color: "#ffffff", opacity: 0.9 }}>
                  {companyInfo.address}
                </Text>
              </View>
            )}

            {companyInfo.phone && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.primary[500],
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 14,
                }}>
                  <Svg width="16" height="16" viewBox="0 0 16 16">
                    <Path d="M14.5 11.58v2.17c0 .5-.42.92-.92.87a13.83 13.83 0 01-6.03-2.14 13.64 13.64 0 01-4.2-4.2A13.83 13.83 0 011.22 2.42.87.87 0 012.08 1.5h2.17c.42 0 .77.3.85.71.09.61.25 1.2.48 1.77a.87.87 0 01-.2.92L4.4 5.88a11.04 11.04 0 004.2 4.2l.98-.98a.87.87 0 01.92-.2c.56.23 1.16.39 1.77.48.42.08.72.43.72.86l.5.34z" fill="#ffffff" />
                  </Svg>
                </View>
                <Text style={{ fontSize: 13, color: "#ffffff", opacity: 0.9 }}>
                  {companyInfo.phone}
                </Text>
              </View>
            )}

            {companyInfo.fax && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.navy[600],
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 14,
                }}>
                  <Svg width="16" height="16" viewBox="0 0 16 16">
                    <Rect x="2" y="4" width="12" height="10" rx="1" stroke="#ffffff" strokeWidth="1.5" fill="none" />
                    <Line x1="4" y1="7" x2="12" y2="7" stroke="#ffffff" strokeWidth="1" />
                    <Line x1="4" y1="9" x2="10" y2="9" stroke="#ffffff" strokeWidth="1" />
                  </Svg>
                </View>
                <Text style={{ fontSize: 13, color: "#ffffff", opacity: 0.9 }}>
                  {companyInfo.fax}
                </Text>
              </View>
            )}

            {companyInfo.email && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.primary[500],
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 14,
                }}>
                  <Svg width="16" height="16" viewBox="0 0 16 16">
                    <Rect x="2" y="3" width="12" height="10" rx="1" stroke="#ffffff" strokeWidth="1.5" fill="none" />
                    <Path d="M2 4l6 4 6-4" stroke="#ffffff" strokeWidth="1.5" fill="none" />
                  </Svg>
                </View>
                <Text style={{ fontSize: 13, color: "#ffffff", opacity: 0.9 }}>
                  {companyInfo.email}
                </Text>
              </View>
            )}

            {websiteUrl && (
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.primary[400],
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 14,
                }}>
                  <Svg width="16" height="16" viewBox="0 0 16 16">
                    <Circle cx="8" cy="8" r="6" stroke="#ffffff" strokeWidth="1.5" fill="none" />
                    <Path d="M2 8h12M8 2c-2 2-2 10 0 12M8 2c2 2 2 10 0 12" stroke="#ffffff" strokeWidth="1" fill="none" />
                  </Svg>
                </View>
                <Text style={{ fontSize: 13, color: colors.primary[400], fontWeight: 700 }}>
                  {websiteUrl}
                </Text>
              </View>
            )}
          </View>

          {/* Tagline */}
          <Text style={{
            fontSize: 16,
            color: colors.primary[400],
            marginTop: 45,
            fontWeight: 600,
            letterSpacing: 1,
          }}>
            함께 성장하는 파트너가 되겠습니다
          </Text>
        </View>

        {/* QR Code section */}
        {qrCodeDataUrl && websiteUrl && (
          <View style={{
            width: 200,
            alignItems: "center",
            marginLeft: 50,
          }}>
            <View style={{
              backgroundColor: "#ffffff",
              padding: 16,
              borderRadius: 16,
            }}>
              <Image src={qrCodeDataUrl} style={{ width: 130, height: 130 }} />
            </View>
            <Text style={{
              fontSize: 11,
              color: "#ffffff",
              opacity: 0.7,
              marginTop: 16,
              textAlign: "center",
            }}>
              QR코드를 스캔하여
            </Text>
            <Text style={{
              fontSize: 11,
              color: "#ffffff",
              opacity: 0.7,
              textAlign: "center",
            }}>
              홈페이지를 방문하세요
            </Text>
          </View>
        )}
      </View>

      {/* Bottom bar */}
      <View style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 6,
        backgroundColor: colors.primary[500],
      }} />
    </View>
  </Page>
);

// ============================================
// Main PDF Component
// ============================================
interface BrochurePDFProps {
  data: BrochureData;
  companyName?: string;
  companyInfo?: {
    address: string;
    phone: string;
    email: string;
    fax: string;
  };
  qrCodeDataUrl?: string;
}

export default function BrochurePDF({
  data,
  companyName = "OJU CONSTRUCTION",
  companyInfo = { address: "", phone: "", email: "", fax: "" },
  qrCodeDataUrl,
}: BrochurePDFProps) {
  const tagline = data.tagline || "기술의 정교함, 신뢰의 견고함";

  const renderCover = () => {
    switch (data.coverStyle) {
      case "gradient":
        return <GradientCover companyName={companyName} tagline={tagline} />;
      case "lines":
        return <LinesCover companyName={companyName} tagline={tagline} />;
      case "photo":
        return <PhotoCover companyName={companyName} tagline={tagline} />;
      case "geometric":
      default:
        return <GeometricCover companyName={companyName} tagline={tagline} />;
    }
  };

  return (
    <Document>
      {renderCover()}
      <VisionMissionPage data={data} companyName={companyName} />
      <BusinessAreasPage data={data} companyName={companyName} />
      <HistoryPage data={data} companyName={companyName} />
      <OrganizationPage data={data} companyName={companyName} />
      <CertificationsPage data={data} companyName={companyName} />
      <ContactPage
        companyName={companyName}
        companyInfo={companyInfo}
        websiteUrl={data.websiteUrl}
        qrCodeDataUrl={qrCodeDataUrl}
      />
    </Document>
  );
}

// QR Code utility function
export async function generateQRCodeDataUrl(url: string): Promise<string | null> {
  if (!url) return null;
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: {
        dark: "#1f2937",
        light: "#ffffff",
      },
    });
    return dataUrl;
  } catch {
    console.error("QR코드 생성 실패");
    return null;
  }
}

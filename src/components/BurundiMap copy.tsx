import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import provincesGeoJsonRaw from "@/assets/burundi-provinces.geojson?raw";

type Point = {
  x: number;
  y: number;
};

type ProvinceProperties = {
  admin1_grid_id: string;
  admin1_name: string;
  [key: string]: string | null;
};

type PolygonCoordinates = number[][][];
type MultiPolygonCoordinates = number[][][][];

type ProvinceGeometry =
  | { type: "Polygon"; coordinates: PolygonCoordinates }
  | { type: "MultiPolygon"; coordinates: MultiPolygonCoordinates };

type ProvinceFeature = {
  type: "Feature";
  properties: ProvinceProperties;
  geometry: ProvinceGeometry;
};

type ProvinceFeatureCollection = {
  type: "FeatureCollection";
  features: ProvinceFeature[];
};

export type BurundiProvince = {
  id: string;
  name: string;
  path: string;
  centroid: Point;
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  properties: ProvinceProperties;
};

export type BurundiProvinceStyle = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  className?: string;
};

type ProvinceStyleMap = Record<string, BurundiProvinceStyle>;

export type BurundiMapProps = {
  className?: string;
  svgClassName?: string;
  provinceClassName?: string;
  defaultFill?: string;
  defaultStroke?: string;
  defaultStrokeWidth?: number;
  hoverFill?: string;
  selectedFill?: string;
  selectedStroke?: string;
  activeProvinceId?: string | null;
  selectedProvinceIds?: string[];
  provinceStyles?: ProvinceStyleMap;
  onProvinceClick?: (province: BurundiProvince) => void;
  onProvinceEnter?: (province: BurundiProvince) => void;
  onProvinceLeave?: (province: BurundiProvince) => void;
  renderProvinceOverlay?: (province: BurundiProvince) => ReactNode;
  renderOverlay?: (provinces: BurundiProvince[]) => ReactNode;
  ariaLabel?: string;
};

const VIEWBOX_WIDTH = 700;
const VIEWBOX_HEIGHT = 760;
const VIEWBOX_PADDING = 28;

const geoJson = JSON.parse(provincesGeoJsonRaw) as ProvinceFeatureCollection;

const coordinateBounds = getCoordinateBounds(geoJson.features);
const projectedProvinces = projectProvinces(geoJson.features);

export function BurundiMap({
  className = "",
  svgClassName = "",
  provinceClassName = "",
  defaultFill = "#b7bac1",
  defaultStroke = "#ffffff",
  defaultStrokeWidth = 1.8,
  hoverFill = "#9fa5af",
  selectedFill = "#51bbbf",
  selectedStroke = "#ffffff",
  activeProvinceId = null,
  selectedProvinceIds = [],
  provinceStyles,
  onProvinceClick,
  onProvinceEnter,
  onProvinceLeave,
  renderProvinceOverlay,
  renderOverlay,
  ariaLabel = "Carte interactive des provinces du Burundi",
}: BurundiMapProps) {
  const [hoveredProvinceId, setHoveredProvinceId] = useState<string | null>(
    null,
  );

  const normalizedSelection = useMemo(
    () => new Set(selectedProvinceIds.map((value) => value.toLowerCase())),
    [selectedProvinceIds],
  );

  return (
    <div className={`relative w-full scale-130 ${className}`.trim()}>
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label={ariaLabel}
        className={`block h-auto w-full ${svgClassName}`.trim()}
      >
        {projectedProvinces.map((province) => {
          const styleConfig =
            provinceStyles?.[province.id] ??
            provinceStyles?.[province.name] ??
            provinceStyles?.[province.name.toLowerCase()];

          const isSelected =
            activeProvinceId === province.id ||
            activeProvinceId === province.name ||
            normalizedSelection.has(province.id.toLowerCase()) ||
            normalizedSelection.has(province.name.toLowerCase());

          const isHovered = hoveredProvinceId === province.id;
          const fill =
            styleConfig?.fill ??
            (isSelected ? selectedFill : isHovered ? hoverFill : defaultFill);
          const stroke =
            styleConfig?.stroke ??
            (isSelected ? selectedStroke : defaultStroke);
          const strokeWidth = styleConfig?.strokeWidth ?? defaultStrokeWidth;
          const opacity = styleConfig?.opacity ?? 1;

          return (
            <g
              key={province.id}
              data-province-id={province.id}
              data-province-name={province.name}
            >
              <path
                d={province.path}
                aria-label={province.name}
                tabIndex={0}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                opacity={opacity}
                className={`cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:opacity-85 ${provinceClassName} ${styleConfig?.className ?? ""}`.trim()}
                onMouseEnter={() => {
                  setHoveredProvinceId(province.id);
                  onProvinceEnter?.(province);
                }}
                onMouseLeave={() => {
                  setHoveredProvinceId((current) =>
                    current === province.id ? null : current,
                  );
                  onProvinceLeave?.(province);
                }}
                onClick={() => onProvinceClick?.(province)}
                onKeyDown={(event) =>
                  handleProvinceKeyDown(event, province, onProvinceClick)
                }
              />
              {renderProvinceOverlay ? renderProvinceOverlay(province) : null}
            </g>
          );
        })}
        {renderOverlay ? renderOverlay(projectedProvinces) : null}
      </svg>
    </div>
  );
}

function handleProvinceKeyDown(
  event: KeyboardEvent<SVGPathElement>,
  province: BurundiProvince,
  onProvinceClick?: (province: BurundiProvince) => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onProvinceClick?.(province);
  }
}

function getCoordinateBounds(features: ProvinceFeature[]) {
  let minLon = Number.POSITIVE_INFINITY;
  let maxLon = Number.NEGATIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;

  for (const feature of features) {
    const polygons =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;

    for (const polygon of polygons) {
      for (const ring of polygon) {
        for (const [lon, lat] of ring) {
          minLon = Math.min(minLon, lon);
          maxLon = Math.max(maxLon, lon);
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
        }
      }
    }
  }

  return { minLon, maxLon, minLat, maxLat };
}

function projectPoint([lon, lat]: number[]): Point {
  const geoWidth = coordinateBounds.maxLon - coordinateBounds.minLon;
  const geoHeight = coordinateBounds.maxLat - coordinateBounds.minLat;
  const scale = Math.min(
    (VIEWBOX_WIDTH - VIEWBOX_PADDING * 2) / geoWidth,
    (VIEWBOX_HEIGHT - VIEWBOX_PADDING * 2) / geoHeight,
  );

  const contentWidth = geoWidth * scale;
  const contentHeight = geoHeight * scale;
  const offsetX = (VIEWBOX_WIDTH - contentWidth) / 2;
  const offsetY = (VIEWBOX_HEIGHT - contentHeight) / 2;

  return {
    x: offsetX + (lon - coordinateBounds.minLon) * scale,
    y: offsetY + (coordinateBounds.maxLat - lat) * scale,
  };
}

function projectProvinces(features: ProvinceFeature[]): BurundiProvince[] {
  return features.map((feature) => {
    const polygons =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;

    const projectedPolygons = polygons.map((polygon) =>
      polygon.map((ring) => ring.map((coordinate) => projectPoint(coordinate))),
    );

    const path = projectedPolygons
      .map((polygon) =>
        polygon
          .map(
            (ring) =>
              ring
                .map(
                  (point, index) =>
                    `${index === 0 ? "M" : "L"}${round(point.x)} ${round(point.y)}`,
                )
                .join(" ") + " Z",
          )
          .join(" "),
      )
      .join(" ");

    const points = projectedPolygons.flat(2);
    const bounds = {
      minX: Math.min(...points.map((point) => point.x)),
      minY: Math.min(...points.map((point) => point.y)),
      maxX: Math.max(...points.map((point) => point.x)),
      maxY: Math.max(...points.map((point) => point.y)),
    };

    const centroid = calculateVisualCentroid(projectedPolygons) ?? {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
    };

    return {
      id: feature.properties.admin1_grid_id,
      name: feature.properties.admin1_name,
      path,
      centroid,
      bounds,
      properties: feature.properties,
    };
  });
}

function calculateVisualCentroid(polygons: Point[][][]): Point | null {
  let weightedX = 0;
  let weightedY = 0;
  let totalArea = 0;

  for (const polygon of polygons) {
    const outerRing = polygon[0];

    if (!outerRing || outerRing.length < 3) {
      continue;
    }

    const centroid = getRingCentroid(outerRing);

    if (!centroid) {
      continue;
    }

    weightedX += centroid.x * centroid.area;
    weightedY += centroid.y * centroid.area;
    totalArea += centroid.area;
  }

  if (totalArea === 0) {
    return null;
  }

  return {
    x: weightedX / totalArea,
    y: weightedY / totalArea,
  };
}

function getRingCentroid(ring: Point[]) {
  let twiceArea = 0;
  let centroidX = 0;
  let centroidY = 0;

  for (let index = 0; index < ring.length; index += 1) {
    const current = ring[index];
    const next = ring[(index + 1) % ring.length];
    const factor = current.x * next.y - next.x * current.y;

    twiceArea += factor;
    centroidX += (current.x + next.x) * factor;
    centroidY += (current.y + next.y) * factor;
  }

  if (twiceArea === 0) {
    return null;
  }

  return {
    x: centroidX / (3 * twiceArea),
    y: centroidY / (3 * twiceArea),
    area: Math.abs(twiceArea / 2),
  };
}

function round(value: number) {
  return Number(value.toFixed(2));
}

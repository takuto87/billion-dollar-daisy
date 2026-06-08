<template>
  <div class="dashboard">
    <!-- ページヘッダー -->
    <div class="dashboard__header">
      <div>
        <h1 class="dashboard__title">
          {{ t('dashboard.title') }}
        </h1>
        <p class="dashboard__subtitle">
          {{ t('dashboard.welcome') }}、管理者さん 👋
        </p>
      </div>
      <div class="dashboard__actions">
        <button id="export-btn" class="btn btn--secondary">
          {{ t('common.export') }}
        </button>
        <button id="add-btn" class="btn btn--primary">
          + {{ t('common.add') }}
        </button>
      </div>
    </div>

    <!-- KPIカード -->
    <div class="dashboard__kpi-grid">
      <article
        v-for="(kpi, index) in kpiCards"
        :id="`kpi-${kpi.id}`"
        :key="kpi.id"
        class="kpi-card"
        :style="{ '--delay': `${index * 0.1}s` }"
      >
        <div class="kpi-card__header">
          <div class="kpi-card__icon" :style="{ background: kpi.iconBg }">
            <span aria-hidden="true">{{ kpi.icon }}</span>
          </div>
          <div
            class="kpi-card__trend"
            :class="kpi.trend > 0 ? 'kpi-card__trend--up' : 'kpi-card__trend--down'"
          >
            {{ kpi.trend > 0 ? '▲' : '▼' }} {{ Math.abs(kpi.trend) }}%
          </div>
        </div>
        <div class="kpi-card__body">
          <p class="kpi-card__label">{{ t(kpi.labelKey) }}</p>
          <p class="kpi-card__value">{{ kpi.value }}</p>
        </div>
        <p class="kpi-card__meta">{{ t('dashboard.vsLastMonth') }}</p>
      </article>
    </div>

    <!-- グラフエリア & 最近のアクティビティ -->
    <div class="dashboard__main-grid">
      <!-- 売上グラフ -->
      <section class="chart-card" aria-label="売上グラフ">
        <div class="chart-card__header">
          <h2 class="chart-card__title">売上推移</h2>
          <div class="chart-card__period">
            <button
              v-for="p in periods"
              :id="`period-${p}`"
              :key="p"
              class="chart-card__period-btn"
              :class="{ active: activePeriod === p }"
              @click="activePeriod = p"
            >
              {{ p }}
            </button>
          </div>
        </div>
        <div class="chart-card__body">
          <!-- SVGグラフ -->
          <svg
            viewBox="0 0 600 200"
            class="chart"
            aria-label="売上折れ線グラフ"
            role="img"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#6c63ff" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#6c63ff" stop-opacity="0" />
              </linearGradient>
            </defs>
            <!-- グリッドライン -->
            <line
              v-for="y in [50, 100, 150]"
              :key="y"
              x1="0"
              :y1="y"
              x2="600"
              :y2="y"
              stroke="rgba(255,255,255,0.05)"
              stroke-width="1"
            />
            <!-- エリア -->
            <path
              :d="areaPath"
              fill="url(#chartGradient)"
            />
            <!-- ライン -->
            <path
              :d="linePath"
              fill="none"
              stroke="#6c63ff"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <!-- データポイント -->
            <circle
              v-for="(point, i) in chartPoints"
              :key="i"
              :cx="point.x"
              :cy="point.y"
              r="4"
              fill="#6c63ff"
              stroke="#1e2130"
              stroke-width="2"
            />
          </svg>
          <!-- X軸ラベル -->
          <div class="chart__labels">
            <span v-for="label in chartLabels" :key="label">{{ label }}</span>
          </div>
        </div>
      </section>

      <!-- 最近のアクティビティ -->
      <section class="activity-card" aria-label="最近のアクティビティ">
        <div class="activity-card__header">
          <h2 class="activity-card__title">{{ t('dashboard.recentActivity') }}</h2>
          <button id="view-all-btn" class="activity-card__view-all">
            {{ t('dashboard.viewAll') }} →
          </button>
        </div>
        <ul class="activity-list">
          <li
            v-for="(activity, index) in recentActivities"
            :key="activity.id"
            class="activity-item"
            :style="{ '--delay': `${index * 0.08}s` }"
          >
            <div class="activity-item__avatar" :style="{ background: activity.color }">
              {{ activity.initials }}
            </div>
            <div class="activity-item__content">
              <p class="activity-item__text">{{ activity.text }}</p>
              <p class="activity-item__time">{{ activity.time }}</p>
            </div>
            <div class="activity-item__badge" :class="`activity-item__badge--${activity.type}`">
              {{ activity.badge }}
            </div>
          </li>
        </ul>
      </section>
    </div>

    <!-- データテーブル -->
    <section class="table-card" aria-label="ユーザー一覧">
      <div class="table-card__header">
        <h2 class="table-card__title">最近のユーザー</h2>
        <NuxtLink id="users-link" to="/users" class="table-card__link">
          {{ t('dashboard.viewAll') }} →
        </NuxtLink>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ユーザー</th>
              <th>メール</th>
              <th>ステータス</th>
              <th>登録日</th>
              <th>売上</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in tableUsers" :key="user.id">
              <td>
                <div class="table-user">
                  <div class="table-user__avatar" :style="{ background: user.color }">
                    {{ user.initials }}
                  </div>
                  <span class="table-user__name">{{ user.name }}</span>
                </div>
              </td>
              <td class="table-muted">{{ user.email }}</td>
              <td>
                <span class="status-badge" :class="`status-badge--${user.status}`">
                  {{ user.statusLabel }}
                </span>
              </td>
              <td class="table-muted">{{ user.joinDate }}</td>
              <td class="table-value">{{ user.revenue }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { t } = useI18n()

const activePeriod = ref('月')
const periods = ['週', '月', '年']

const kpiCards = [
  {
    id: 'total-users',
    labelKey: 'dashboard.totalUsers',
    value: '24,521',
    trend: 12.5,
    icon: '👥',
    iconBg: 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(168,85,247,0.3))',
  },
  {
    id: 'active-users',
    labelKey: 'dashboard.activeUsers',
    value: '18,302',
    trend: 8.2,
    icon: '📊',
    iconBg: 'linear-gradient(135deg, rgba(34,211,165,0.3), rgba(56,189,248,0.3))',
  },
  {
    id: 'revenue',
    labelKey: 'dashboard.revenue',
    value: '¥4,820万',
    trend: 23.1,
    icon: '💰',
    iconBg: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(239,68,68,0.3))',
  },
  {
    id: 'growth',
    labelKey: 'dashboard.growth',
    value: '+18.7%',
    trend: -2.4,
    icon: '📈',
    iconBg: 'linear-gradient(135deg, rgba(239,68,68,0.3), rgba(245,158,11,0.3))',
  },
]

// チャートデータ
const rawData = [60, 95, 70, 130, 90, 150, 110, 170, 140, 180, 155, 200]
const chartLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const chartPoints = computed(() => {
  const maxVal = Math.max(...rawData)
  const minVal = Math.min(...rawData)
  const range = maxVal - minVal || 1
  return rawData.map((v, i) => ({
    x: (i / (rawData.length - 1)) * 560 + 20,
    y: 180 - ((v - minVal) / range) * 150 + 10,
  }))
})

const linePath = computed(() => {
  return chartPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
})

const areaPath = computed(() => {
  const pts = chartPoints.value
  const first = pts[0]
  const last = pts[pts.length - 1]
  return `${linePath.value} L${last.x},200 L${first.x},200 Z`
})

const recentActivities = [
  { id: 1, initials: '田', text: '田中さんが新規登録しました', time: '2分前', type: 'success', badge: '新規', color: 'linear-gradient(135deg, #6c63ff, #a855f7)' },
  { id: 2, initials: '鈴', text: '鈴木さんがプラン変更しました', time: '15分前', type: 'info', badge: '変更', color: 'linear-gradient(135deg, #22d3a5, #38bdf8)' },
  { id: 3, initials: '山', text: '山田さんが支払い完了しました', time: '1時間前', type: 'success', badge: '完了', color: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { id: 4, initials: '伊', text: '伊藤さんがサポートに問い合わせました', time: '3時間前', type: 'warning', badge: '対応中', color: 'linear-gradient(135deg, #ef4444, #f59e0b)' },
  { id: 5, initials: '渡', text: '渡辺さんがアカウントを削除しました', time: '昨日', type: 'danger', badge: '削除', color: 'linear-gradient(135deg, #6c63ff, #38bdf8)' },
]

const tableUsers = [
  { id: 1, initials: '田', name: '田中 太郎', email: 'tanaka@example.com', status: 'active', statusLabel: 'アクティブ', joinDate: '2026/05/01', revenue: '¥128,000', color: 'linear-gradient(135deg, #6c63ff, #a855f7)' },
  { id: 2, initials: '鈴', name: '鈴木 花子', email: 'suzuki@example.com', status: 'active', statusLabel: 'アクティブ', joinDate: '2026/04/15', revenue: '¥84,500', color: 'linear-gradient(135deg, #22d3a5, #38bdf8)' },
  { id: 3, initials: '山', name: '山田 次郎', email: 'yamada@example.com', status: 'pending', statusLabel: '審査中', joinDate: '2026/05/20', revenue: '¥32,000', color: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { id: 4, initials: '伊', name: '伊藤 美咲', email: 'ito@example.com', status: 'inactive', statusLabel: '非アクティブ', joinDate: '2026/03/08', revenue: '¥0', color: 'linear-gradient(135deg, #ef4444, #f59e0b)' },
  { id: 5, initials: '渡', name: '渡辺 健一', email: 'watanabe@example.com', status: 'active', statusLabel: 'アクティブ', joinDate: '2026/01/22', revenue: '¥256,800', color: 'linear-gradient(135deg, #6c63ff, #38bdf8)' },
]
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;

  &__header {
    @include flex-between;
    @include slide-up(0.4s);
    flex-wrap: wrap;
    gap: $spacing-md;
  }

  &__title {
    font-size: $font-size-3xl;
    font-weight: 700;
    @include gradient-text;
    margin-bottom: $spacing-xs;
  }

  &__subtitle {
    color: $color-text-secondary;
    font-size: $font-size-base;
  }

  &__actions {
    display: flex;
    gap: $spacing-sm;
  }

  &__kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: $spacing-lg;
  }

  &__main-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: $spacing-lg;

    @include respond-below('xl') {
      grid-template-columns: 1fr;
    }
  }
}

// ─── ボタン ───────────────────────────────────────────────────────
.btn {
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  font-weight: 600;
  transition: all $transition-fast;
  cursor: pointer;

  &--primary {
    background: $color-accent-gradient;
    color: white;
    border: none;

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: $shadow-glow;
    }
  }

  &--secondary {
    background: transparent;
    color: $color-text-secondary;
    border: 1px solid $color-border;

    &:hover {
      border-color: $color-accent-primary;
      color: $color-accent-primary;
    }
  }
}

// ─── KPIカード ────────────────────────────────────────────────────
.kpi-card {
  @include card;
  animation: slideUp 0.5s ease var(--delay, 0s) both;

  &__header {
    @include flex-between;
    margin-bottom: $spacing-md;
  }

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: $radius-md;
    @include flex-center;
    font-size: $font-size-xl;
  }

  &__trend {
    font-size: $font-size-xs;
    font-weight: 600;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-full;

    &--up {
      color: $color-success;
      background: rgba($color-success, 0.1);
    }

    &--down {
      color: $color-danger;
      background: rgba($color-danger, 0.1);
    }
  }

  &__label {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin-bottom: $spacing-xs;
  }

  &__value {
    font-size: $font-size-2xl;
    font-weight: 700;
    color: $color-text-primary;
  }

  &__meta {
    font-size: $font-size-xs;
    color: $color-text-muted;
    margin-top: $spacing-sm;
  }
}

// ─── チャートカード ───────────────────────────────────────────────
.chart-card {
  @include card;
  @include slide-up(0.4s, 0.2s);

  &__header {
    @include flex-between;
    margin-bottom: $spacing-lg;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $color-text-primary;
  }

  &__period {
    display: flex;
    gap: $spacing-xs;
  }

  &__period-btn {
    padding: $spacing-xs $spacing-md;
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    font-weight: 500;
    color: $color-text-secondary;
    transition: all $transition-fast;

    &:hover {
      background: $color-bg-hover;
      color: $color-text-primary;
    }

    &.active {
      background: rgba($color-accent-primary, 0.2);
      color: $color-accent-primary;
    }
  }

  &__body {
    position: relative;
  }
}

.chart {
  width: 100%;
  height: auto;
  overflow: visible;
  display: block;

  &__labels {
    display: flex;
    justify-content: space-between;
    margin-top: $spacing-sm;
    padding: 0 20px;
    color: $color-text-muted;
    font-size: $font-size-xs;
  }
}

// ─── アクティビティカード ─────────────────────────────────────────
.activity-card {
  @include card;
  @include slide-up(0.4s, 0.3s);

  &__header {
    @include flex-between;
    margin-bottom: $spacing-lg;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $color-text-primary;
  }

  &__view-all {
    font-size: $font-size-sm;
    color: $color-accent-primary;
    transition: opacity $transition-fast;

    &:hover {
      opacity: 0.8;
    }
  }
}

.activity-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  animation: slideInLeft 0.4s ease var(--delay, 0s) both;

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: $radius-full;
    @include flex-center;
    font-size: $font-size-sm;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__text {
    font-size: $font-size-sm;
    color: $color-text-primary;
    @include truncate;
  }

  &__time {
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__badge {
    font-size: $font-size-xs;
    font-weight: 600;
    padding: 2px $spacing-sm;
    border-radius: $radius-full;
    white-space: nowrap;

    &--success {
      color: $color-success;
      background: rgba($color-success, 0.1);
    }

    &--info {
      color: $color-info;
      background: rgba($color-info, 0.1);
    }

    &--warning {
      color: $color-warning;
      background: rgba($color-warning, 0.1);
    }

    &--danger {
      color: $color-danger;
      background: rgba($color-danger, 0.1);
    }
  }
}

// ─── テーブルカード ───────────────────────────────────────────────
.table-card {
  @include card;
  @include slide-up(0.4s, 0.4s);

  &__header {
    @include flex-between;
    margin-bottom: $spacing-lg;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $color-text-primary;
  }

  &__link {
    font-size: $font-size-sm;
    color: $color-accent-primary;
    transition: opacity $transition-fast;

    &:hover {
      opacity: 0.8;
    }
  }
}

.table-wrapper {
  overflow-x: auto;
  @include custom-scrollbar(4px);
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    font-size: $font-size-xs;
    font-weight: 600;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: $spacing-sm $spacing-md;
    border-bottom: 1px solid $color-border;
    white-space: nowrap;
  }

  td {
    padding: $spacing-md;
    border-bottom: 1px solid rgba($color-border, 0.5);
    font-size: $font-size-sm;
    color: $color-text-primary;
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: rgba($color-bg-hover, 0.5);
  }
}

.table-muted {
  color: $color-text-secondary !important;
}

.table-value {
  font-weight: 600;
}

.table-user {
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: $radius-full;
    @include flex-center;
    font-size: $font-size-xs;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
  }

  &__name {
    font-weight: 500;
    white-space: nowrap;
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px $spacing-sm;
  border-radius: $radius-full;
  font-size: $font-size-xs;
  font-weight: 600;

  &--active {
    color: $color-success;
    background: rgba($color-success, 0.1);
  }

  &--pending {
    color: $color-warning;
    background: rgba($color-warning, 0.1);
  }

  &--inactive {
    color: $color-text-muted;
    background: rgba($color-text-muted, 0.1);
  }
}
</style>

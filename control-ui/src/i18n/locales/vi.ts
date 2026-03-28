import type { TranslationMap } from "../lib/types.ts";

export const vi: TranslationMap = {
  common: {
    health: "Sức khỏe",
    ok: "OK",
    online: "Trực tuyến",
    offline: "Ngoại tuyến",
    connect: "Kết nối",
    refresh: "Làm mới",
    enabled: "Bật",
    disabled: "Tắt",
    na: "không có",
    version: "Phiên bản",
    docs: "Tài liệu",
    theme: "Giao diện",
    resources: "Tài nguyên",
    search: "Tìm kiếm",
  },
  desktopUpdate: {
    availableTitle: "Đã có bản cập nhật:",
    newVersion: "{version}",
    downloading: "Đang tải...",
    updateButton: "Cập nhật ngay",
    updatingButton: "Đang cập nhật…",
    installButton: "Khởi động lại",
    dismissBannerAria: "Ẩn thông báo cập nhật ứng dụng",
    downloadCompleteTitle: "Đã chạy cập nhật",
  },
  nav: {
    chat: "Trò chuyện",
    control: "Điều khiển",
    agent: "Agent",
    settings: "Cài đặt",
    expand: "Mở rộng thanh bên",
    collapse: "Thu gọn thanh bên",
    resize: "Thay đổi kích thước thanh bên",
  },
  tabs: {
    agents: "Agent",
    overview: "Tổng quan",
    channels: "Kênh",
    instances: "Phiên bản",
    sessions: "Phiên làm việc",
    usage: "Sử dụng",
    cron: "Cron",
    skills: "Kỹ năng",
    nodes: "Nodes",
    chat: "Trò chuyện",
    config: "Cấu hình",
    communications: "Liên lạc",
    appearance: "Hiển thị",
    automation: "Tự động",
    infrastructure: "Hạ tầng",
    aiAgents: "AI & Agent",
    debug: "Gỡ lỗi",
    logs: "Nhật ký",
    files: "Tệp",
    tools: "Công cụ",
  },
  subtitles: {
    agents: "Không gian làm việc, công cụ, danh tính.",
    overview: "Trạng thái, điểm vào, sức khỏe.",
    channels: "Kênh và cài đặt.",
    instances: "Client và Nodes đã kết nối.",
    sessions: "Phiên đang hoạt động và mặc định.",
    usage: "Token API và chi phí.",
    cron: "Đánh thức và chạy định kỳ.",
    skills: "Kỹ năng và khóa API.",
    nodes: "Thiết bị ghép cặp và lệnh.",
    chat: "Chat gateway để can thiệp nhanh.",
    config: "Chỉnh openclaw.json.",
    communications: "Kênh, tin nhắn và âm thanh.",
    appearance: "Chủ đề, UI và trình hướng dẫn.",
    automation: "Lệnh, hook, cron và plugin.",
    infrastructure: "Thiết lập gateway, web, trình duyệt và phương tiện.",
    aiAgents: "Agent, model, kỹ năng, công cụ, bộ nhớ, phiên.",
    debug: "Ảnh chụp trạng thái, sự kiện, RPC.",
    logs: "Nhật ký gateway trực tiếp.",
  },
  instances: {
    connectedInstances: {
      title: "Các phiên đang kết nối",
      subtitle: "Tín hiệu hiện diện từ gateway và các client.",
    },
    toggleHosts: {
      show: "Hiện hosts và IP",
      hide: "Ẩn hosts và IP",
      ariaLabel: "Bật/tắt hiển thị host và IP",
    },
    loading: "Đang tải…",
    empty: "Chưa có phiên nào được báo cáo.",
    unknownMode: "không rõ",
    unknownHost: "host không rõ",
    scopes: {
      count: "{count} phạm vi",
      list: "Phạm vi: {scopes}",
    },
    labels: {
      lastInput: "Lần nhập cuối {value}",
      reason: "Lý do {value}",
      reasonUnknown: "Lý do",
    },
    relativeTime: {
      justNow: "Vừa xong",
      yesterday: "Hôm qua",
      value: "{count} {unit} trước",
      units: {
        s: "giây",
        m: "phút",
        h: "giờ",
        d: "ngày",
        w: "tuần",
      },
    },
  },
  sessions: {
    title: "Phiên làm việc",
    loading: "Đang tải…",
    cardSub: {
      store: "Kho: {path}",
      active: "Các khóa phiên đang hoạt động và ghi đè theo phiên.",
    },
    filters: {
      active: "Hoạt động",
      limit: "Giới hạn",
      minPlaceholder: "min",
      global: "Toàn cục",
      unknown: "Không rõ",
    },
    search: {
      placeholder: "Lọc theo key, label, kind…",
    },
    bulk: {
      selected: "{count} đã chọn",
      unselect: "Bỏ chọn",
      delete: "Xóa",
    },
    table: {
      selectAllOnPage: "Chọn tất cả trên trang",
      selectSession: "Chọn phiên",
      headers: {
        key: "Key",
        label: "Nhãn",
        kind: "Loại",
        updated: "Cập nhật",
        tokens: "Token",
        thinking: "Suy nghĩ",
        fast: "Nhanh",
        verbose: "Chi tiết",
        reasoning: "Lập luận",
      },
    },
    empty: {
      noSessions: "Không có phiên nào.",
    },
    pagination: {
      info: {
        single: "{start}-{end} trên {total} phiên",
        plural: "{start}-{end} trên {total} phiên",
      },
      pageSizeOption: "{size} mỗi trang",
      previous: "Trước",
      next: "Tiếp theo",
    },
    row: {
      optionalPlaceholder: "(tùy chọn)",
    },
    relativeTime: {
      justNow: "Vừa xong",
      yesterday: "Hôm qua",
      value: "{count} {unit} trước",
      units: {
        s: "giây",
        m: "phút",
        h: "giờ",
        d: "ngày",
        w: "tuần",
      },
    },
    levels: {
      inherit: "Kế thừa",
      off: "tắt",
      on: "bật",
      custom: "tùy chọn",
      offExplicit: "tắt (tường minh)",
      full: "đầy đủ",
      stream: "stream",
    },
    thinkingLevels: {
      minimal: "tối giản",
      low: "thấp",
      medium: "trung bình",
      high: "cao",
      xhigh: "rất cao",
    },
  },
  debugPage: {
    snapshots: {
      title: "Ảnh chụp trạng thái",
      subtitle: "Trạng thái, sức khỏe và dữ liệu heartbeat.",
    },
    refresh: "Làm mới",
    refreshing: "Đang làm mới…",
    status: "Trạng thái",
    health: "Sức khỏe",
    lastHeartbeat: "Heartbeat gần nhất",
    security: {
      critical: "{count} mức nghiêm trọng",
      warnings: "{count} cảnh báo",
      none: "Không có vấn đề nghiêm trọng",
      infoSuffix: " · {count} thông tin",
      auditPrefix: "Kiểm tra bảo mật:",
      runPrefix: "Chạy ",
      runSuffix: " để xem chi tiết.",
    },
    manualRpc: {
      title: "RPC thủ công",
      subtitle: "Gửi một phương thức gateway thô kèm tham số JSON.",
    },
    method: "Phương thức",
    selectMethod: "Chọn phương thức…",
    paramsJson: "Tham số (JSON)",
    call: "Gọi",
    models: {
      title: "Mô hình",
      subtitle: "Danh mục từ models.list.",
    },
    eventLog: {
      title: "Nhật ký sự kiện",
      subtitle: "Các sự kiện gateway mới nhất.",
      empty: "Chưa có sự kiện.",
    },
  },
  logsPage: {
    title: "Nhật ký",
    subtitle: "Nhật ký tệp gateway (JSONL).",
    loading: "Đang tải…",
    refresh: "Làm mới",
    autoFollow: "Tự bám theo",
    file: "Tệp",
    truncated: "Đầu ra log đã bị cắt; đang hiển thị phần mới nhất.",
    empty: "Không có bản ghi log.",
    filter: {
      label: "Bộ lọc",
      placeholder: "Tìm trong nhật ký",
    },
    export: {
      label: "Xuất",
      filtered: "đã lọc",
      visible: "đang hiển thị",
    },
  },
  overview: {
    access: {
      title: "Truy cập Gateway",
      subtitle: "Dashboard kết nối ở đâu và xác thực thế nào.",
      wsUrl: "URL WebSocket",
      token: "Token Gateway",
      password: "Mật khẩu (không lưu)",
      sessionKey: "Khóa phiên mặc định",
      language: "Ngôn ngữ",
      connectHint: "Nhấn Kết nối để áp dụng thay đổi.",
      trustedProxy: "Đã xác thực qua proxy tin cậy.",
    },
    snapshot: {
      title: "Ảnh chụp trạng thái",
      subtitle: "Thông tin bắt tay gateway mới nhất.",
      status: "Trạng thái",
      uptime: "Thời gian chạy",
      tickInterval: "Chu kỳ tick",
      lastChannelsRefresh: "Làm mới kênh lần cuối",
      channelsHint:
        "Dùng Kênh để liên kết WhatsApp, Telegram, Discord, Signal hoặc iMessage.",
    },
    stats: {
      instances: "Phiên bản",
      instancesHint: "Tín hiệu hiện diện trong 5 phút qua.",
      sessions: "Phiên",
      sessionsHint: "Khóa phiên gần đây do gateway theo dõi.",
      cron: "Cron",
      cronNext: "Lần đánh thức tiếp {time}",
    },
    notes: {
      title: "Ghi chú",
      subtitle: "Nhắc nhanh cho thiết lập điều khiển từ xa.",
      tailscaleTitle: "Tailscale serve",
      tailscaleText:
        "Nên dùng chế độ serve để gateway ở loopback với xác thực tailnet.",
      sessionTitle: "Vệ sinh phiên",
      sessionText: "Dùng /new hoặc sessions.patch để reset ngữ cảnh.",
      cronTitle: "Nhắc Cron",
      cronText: "Dùng phiên tách biệt cho các lần chạy định kỳ.",
    },
    auth: {
      required:
        "Gateway cần xác thực. Thêm token hoặc mật khẩu, rồi nhấn Kết nối.",
      failed:
        "Xác thực thất bại. Sao chép lại URL có token bằng {command}, hoặc cập nhật token, rồi Kết nối.",
    },
    pairing: {
      hint: "Thiết bị này cần được phê duyệt ghép cặp từ máy chủ gateway.",
      mobileHint:
        "Trên di động? Sao chép URL đầy đủ (gồm #token=...) từ openclaw dashboard --no-open trên máy tính.",
    },
    insecure: {
      hint: "Trang này là HTTP nên trình duyệt chặn nhận dạng thiết bị. Dùng HTTPS (Tailscale Serve) hoặc mở {url} trên máy gateway.",
      stayHttp: "Nếu bắt buộc HTTP, đặt {config} (chỉ token).",
    },
    connection: {
      title: "Cách kết nối",
      step1: "Khởi động gateway trên máy chủ:",
      step2: "Lấy URL dashboard có token:",
      step3:
        "Dán URL WebSocket và token phía trên, hoặc mở trực tiếp URL có token.",
      step4: "Hoặc tạo token tái sử dụng:",
      docsHint: "Truy cập từ xa nên dùng Tailscale Serve. ",
      docsLink: "Đọc tài liệu →",
    },
    cards: {
      cost: "Chi phí",
      skills: "Kỹ năng",
      recentSessions: "Phiên gần đây",
    },
    attention: {
      title: "Chú ý",
    },
    eventLog: {
      title: "Nhật ký sự kiện",
    },
    logTail: {
      title: "Nhật ký Gateway",
    },
    quickActions: {
      newSession: "Phiên mới",
      automation: "Tự động",
      refreshAll: "Làm mới tất cả",
      terminal: "Terminal",
    },
    palette: {
      placeholder: "Gõ lệnh…",
      noResults: "Không có kết quả",
    },
  },
  usage: {
    page: {
      subtitle:
        "Xem token đi đâu, khi nào phiên tăng đột biến và điều gì tốn chi phí.",
    },
    common: {
      emptyValue: "—",
      unknown: "không rõ",
    },
    loading: {
      title: "Tổng quan sử dụng",
      badge: "Đang tải",
    },
    metrics: {
      tokens: "Token",
      cost: "Chi phí",
      session: "phiên",
      sessions: "phiên",
    },
    presets: {
      today: "Hôm nay",
      last7d: "7 ngày",
      last30d: "30 ngày",
    },
    filters: {
      title: "Bộ lọc",
      to: "đến",
      startDate: "Ngày bắt đầu",
      endDate: "Ngày kết thúc",
      timeZone: "Múi giờ",
      timeZoneLocal: "Mặc Định",
      timeZoneUtc: "UTC",
      pin: "Ghim",
      pinned: "Đã ghim",
      unpin: "Bỏ ghim bộ lọc",
      selectAll: "Chọn tất cả",
      clear: "Xóa",
      clearAll: "Xóa tất cả",
      remove: "Gỡ bộ lọc",
      all: "Tất cả",
      days: "Ngày",
      hours: "Giờ",
      session: "Phiên",
      agent: "Agent",
      channel: "Kênh",
      provider: "Nhà cung cấp",
      model: "Model",
      tool: "Công cụ",
      daysCount: "{count} ngày",
      hoursCount: "{count} giờ",
      sessionsCount: "{count} phiên",
    },
    query: {
      placeholder:
        "Lọc phiên (vd. key:agent:main:cron* model:gpt-4o has:errors minTokens:2000)",
      apply: "Lọc (phía client)",
      matching: "{shown}/{total} phiên khớp",
      inRange: "{total} phiên trong khoảng",
      tip: "Gợi ý: dùng bộ lọc hoặc nhấn cột để thu hẹp ngày.",
    },
    export: {
      label: "Xuất",
      sessionsCsv: "CSV phiên",
      dailyCsv: "CSV theo ngày",
      json: "JSON",
    },
    empty: {
      title: "Chọn khoảng ngày",
      subtitle:
        "Tải dữ liệu sử dụng để so sánh chi phí, xem phiên và timeline mà không rời dashboard.",
      hint: "Chọn khoảng ngày và nhấn Làm mới để tải.",
      noData: "Không có dữ liệu",
      featureOverview: "Thẻ tổng quan",
      featureSessions: "Xếp hạng phiên",
      featureTimeline: "Timeline chi tiết",
    },
    daily: {
      title: "Sử dụng theo ngày",
      total: "Tổng",
      byType: "Theo loại",
      tokensTitle: "Token theo ngày",
      costTitle: "Chi phí theo ngày",
    },
    breakdown: {
      output: "Đầu ra",
      input: "Đầu vào",
      cacheWrite: "Ghi cache",
      cacheRead: "Đọc cache",
      total: "Tổng",
      tokensByType: "Token theo loại",
      costByType: "Chi phí theo loại",
    },
    overview: {
      title: "Tổng quan sử dụng",
      messages: "Tin nhắn",
      messagesHint: "Tổng tin người dùng và trợ lý trong khoảng.",
      messagesAbbrev: "tn",
      user: "người dùng",
      assistant: "trợ lý",
      toolCalls: "Gọi công cụ",
      toolCallsHint: "Tổng lần gọi công cụ trên các phiên.",
      toolsUsed: "công cụ đã dùng",
      errors: "Lỗi",
      errorsHint: "Tổng lỗi tin nhắn và công cụ trong khoảng.",
      toolResults: "kết quả công cụ",
      avgTokens: "TB token / tin",
      avgTokensHint: "Trung bình token mỗi tin trong khoảng.",
      avgCost: "TB chi phí / tin",
      avgCostHint: "Chi phí trung bình mỗi tin khi nhà cung cấp báo giá.",
      avgCostHintMissing:
        "Chi phí trung bình mỗi tin khi có dữ liệu. Một số hoặc tất cả phiên thiếu dữ liệu chi phí.",
      acrossMessages: "Trên {count} tin",
      sessions: "Phiên",
      sessionsHint: "Số phiên khác nhau trong khoảng.",
      sessionsInRange: "trong {count} trong khoảng",
      throughput: "Thông lượng",
      throughputHint: "Token mỗi phút khi hoạt động. Cao hơn tốt hơn.",
      tokensPerMinute: "tok/phút",
      perMinute: "/ phút",
      errorRate: "Tỷ lệ lỗi",
      errorHint: "Tỷ lệ lỗi = lỗi / tổng tin. Thấp hơn tốt hơn.",
      avgSession: "tb phiên",
      cacheHitRate: "Tỷ lệ trúng cache",
      cacheHint:
        "Trúng cache = đọc cache / (đầu vào + đọc cache). Cao hơn tốt hơn.",
      cached: "cache",
      prompt: "prompt",
      calls: "lần gọi",
      topModels: "Model hàng đầu",
      topProviders: "Nhà cung cấp hàng đầu",
      topTools: "Công cụ hàng đầu",
      topAgents: "Agent hàng đầu",
      topChannels: "Kênh hàng đầu",
      peakErrorDays: "Ngày lỗi cao điểm",
      peakErrorHours: "Giờ lỗi cao điểm",
      noModelData: "Không có dữ liệu model",
      noProviderData: "Không có dữ liệu nhà cung cấp",
      noToolCalls: "Không có gọi công cụ",
      noAgentData: "Không có dữ liệu agent",
      noChannelData: "Không có dữ liệu kênh",
      noErrorData: "Không có dữ liệu lỗi",
    },
    sessions: {
      title: "Phiên",
      shown: "{count} hiển thị",
      total: "{count} tổng",
      avg: "tb",
      all: "Tất cả",
      recent: "Xem gần đây",
      recentShort: "Gần đây",
      sort: "Sắp xếp",
      ascending: "Tăng dần",
      descending: "Giảm dần",
      clearSelection: "Bỏ chọn",
      noRecent: "Không có phiên gần đây",
      noneInRange: "Không có phiên trong khoảng",
      more: "+{count} nữa",
      selected: "Đã chọn ({count})",
      copy: "Sao chép",
      copyName: "Sao chép tên phiên",
      limitReached:
        "Chỉ hiển thị 1.000 phiên đầu. Thu hẹp khoảng ngày để xem đủ.",
    },
    details: {
      noUsageData: "Không có dữ liệu sử dụng cho phiên này.",
      duration: "Thời lượng",
      modelMix: "Hỗn hợp model",
      filtered: "(đã lọc)",
      close: "Đóng chi tiết phiên",
      noTimeline: "Không có dữ liệu timeline",
      noDataInRange: "Không có dữ liệu trong khoảng",
      usageOverTime: "Sử dụng theo thời gian",
      reset: "Đặt lại",
      perTurn: "Theo lượt",
      cumulative: "Lũy kế",
      turnRange: "Lượt {start}–{end} / {total}",
      assistantOutputTokens: "Token đầu ra trợ lý",
      userToolInputTokens: "Token đầu vào người dùng + công cụ",
      tokensWrittenToCache: "Token ghi vào cache",
      tokensReadFromCache: "Token đọc từ cache",
      noContextData: "Không có dữ liệu ngữ cảnh",
      systemPromptBreakdown: "Phân tích system prompt",
      collapse: "Thu gọn",
      collapseAll: "Thu tất cả",
      expandAll: "Mở tất cả",
      baseContextPerMessage: "Ngữ cảnh cơ bản mỗi tin",
      system: "Hệ thống",
      systemShort: "Sys",
      skills: "Kỹ năng",
      tools: "Công cụ",
      files: "Tệp",
      ofInput: "của đầu vào",
      of: "của",
      timelineFiltered: "timeline đã lọc",
      conversation: "Hội thoại",
      noMessages: "Không có tin",
      tool: "Công cụ",
      toolResult: "Kết quả công cụ",
      hasTools: "Có công cụ",
      searchConversation: "Tìm trong hội thoại",
      you: "Bạn",
      noMessagesMatch: "Không tin nào khớp bộ lọc.",
    },
    mosaic: {
      title: "Hoạt động theo thời gian",
      subtitleEmpty: "Ước lượng cần mốc thời gian phiên.",
      subtitle:
        "Ước lượng từ khoảng phiên (hoạt động đầu/cuối). Múi giờ: {zone}.",
      noTimelineData: "Chưa có dữ liệu timeline.",
      dayOfWeek: "Ngày trong tuần",
      midnight: "Nửa đêm",
      fourAm: "4 giờ sáng",
      eightAm: "8 giờ sáng",
      noon: "Trưa",
      fourPm: "4 giờ chiều",
      eightPm: "8 giờ tối",
      legend: "Thấp → Mật độ token cao",
      sun: "CN",
      mon: "T2",
      tue: "T3",
      wed: "T4",
      thu: "T5",
      fri: "T6",
      sat: "T7",
    },
  },
  login: {
    subtitle: "Dashboard Gateway",
    passwordPlaceholder: "tùy chọn",
  },
  chat: {
    disconnected: "Đã ngắt kết nối gateway.",
    refreshTitle: "Làm mới dữ liệu chat",
    thinkingToggle: "Bật/tắt hiển thị suy nghĩ của trợ lý",
    toolCallsToggle: "Bật/tắt gọi công cụ và kết quả",
    focusToggle: "Chế độ tập trung (ẩn thanh bên + header)",
    hideCronSessions: "Ẩn phiên cron",
    showCronSessions: "Hiện phiên cron",
    showCronSessionsHidden: "Hiện phiên cron ({count} đang ẩn)",
    onboardingDisabled: "Tắt trong lúc thiết lập",
  },
  languages: {
    vi: "Tiếng Việt",
    en: "English (Tiếng Anh)",
    zhCN: "简体中文 (Tiếng Trung giản thể)",
    zhTW: "繁體中文 (Tiếng Trung phồn thể)",
    ptBR: "Português (Tiếng Bồ Đào Nha - Brazil)",
    de: "Deutsch (Tiếng Đức)",
    es: "Español (Tiếng Tây Ban Nha)",
  },
  cron: {
    summary: {
      enabled: "Bật",
      yes: "Có",
      no: "Không",
      jobs: "Tác vụ",
      nextWake: "Lần đánh thức tiếp",
      refreshing: "Đang làm mới...",
      refresh: "Làm mới",
    },
    jobs: {
      title: "Tác vụ",
      subtitle: "Mọi tác vụ đã lên lịch lưu trên gateway.",
      shownOf: "{shown}/{total} hiển thị",
      searchJobs: "Tìm tác vụ",
      searchPlaceholder: "Tên, mô tả hoặc agent",
      enabled: "Bật",
      schedule: "Lịch",
      lastRun: "Lần chạy cuối",
      all: "Tất cả",
      sort: "Sắp xếp",
      nextRun: "Lần chạy tiếp",
      recentlyUpdated: "Cập nhật gần đây",
      name: "Tên",
      direction: "Hướng",
      ascending: "Tăng dần",
      descending: "Giảm dần",
      reset: "Đặt lại",
      noMatching: "Không có tác vụ khớp.",
      loading: "Đang tải...",
      loadMore: "Tải thêm tác vụ",
    },
    runs: {
      title: "Lịch sử chạy",
      subtitleAll: "Các lần chạy mới nhất trên mọi tác vụ.",
      subtitleJob: "Các lần chạy mới nhất cho {title}.",
      scope: "Phạm vi",
      allJobs: "Mọi tác vụ",
      selectedJob: "Tác vụ đã chọn",
      searchRuns: "Tìm lần chạy",
      searchPlaceholder: "Tóm tắt, lỗi hoặc tác vụ",
      newestFirst: "Mới nhất trước",
      oldestFirst: "Cũ nhất trước",
      status: "Trạng thái",
      delivery: "Gửi kết quả",
      clear: "Xóa",
      allStatuses: "Mọi trạng thái",
      allDelivery: "Mọi kiểu gửi",
      selectJobHint: "Chọn tác vụ để xem lịch sử chạy.",
      noMatching: "Không có lần chạy khớp.",
      loadMore: "Tải thêm lần chạy",
      runStatusOk: "OK",
      runStatusError: "Lỗi",
      runStatusSkipped: "Bỏ qua",
      runStatusUnknown: "Không rõ",
      deliveryDelivered: "Đã gửi",
      deliveryNotDelivered: "Chưa gửi",
      deliveryUnknown: "Không rõ",
      deliveryNotRequested: "Không yêu cầu",
    },
    form: {
      editJob: "Sửa tác vụ",
      newJob: "Tác vụ mới",
      updateSubtitle: "Cập nhật tác vụ đã chọn.",
      createSubtitle: "Tạo đánh thức theo lịch hoặc lần chạy agent.",
      required: "Bắt buộc",
      requiredSr: "bắt buộc",
      basics: "Cơ bản",
      basicsSub: "Đặt tên, chọn trợ lý và trạng thái bật/tắt.",
      fieldName: "Tên",
      description: "Mô tả",
      agentId: "ID Agent",
      namePlaceholder: "Tóm tắt buổi sáng",
      descriptionPlaceholder: "Ngữ cảnh tùy chọn cho tác vụ",
      agentPlaceholder: "main hoặc ops",
      agentHelp: "Gõ để chọn agent có sẵn hoặc nhập tùy chỉnh.",
      schedule: "Lịch",
      scheduleSub: "Điều khiển khi tác vụ chạy.",
      every: "Mỗi",
      at: "Lúc",
      cronOption: "Cron",
      runAt: "Chạy lúc",
      unit: "Đơn vị",
      minutes: "Phút",
      hours: "Giờ",
      days: "Ngày",
      expression: "Biểu thức",
      expressionPlaceholder: "0 7 * * *",
      everyAmountPlaceholder: "30",
      timezoneOptional: "Múi giờ (tùy chọn)",
      timezonePlaceholder: "America/Los_Angeles",
      timezoneHelp: "Chọn múi giờ phổ biến hoặc nhập IANA hợp lệ.",
      jitterHelp: "Cần jitter? Dùng Nâng cao → Cửa sổ trễ / Đơn vị trễ.",
      execution: "Thực thi",
      executionSub: "Chọn khi đánh thức và việc cần làm.",
      session: "Phiên",
      main: "Chính",
      isolated: "Tách biệt",
      sessionHelp:
        "Chính đăng sự kiện hệ thống. Tách biệt chạy một lượt agent riêng.",
      wakeMode: "Chế độ đánh thức",
      now: "Ngay",
      nextHeartbeat: "Nhịp tiếp theo",
      wakeModeHelp: "Ngay kích hoạt tức thì. Nhịp tiếp theo chờ chu kỳ kế.",
      payloadKind: "Chạy gì?",
      systemEvent: "Đăng tin lên timeline chính",
      agentTurn: "Chạy tác vụ trợ lý (tách phiên)",
      systemEventHelp:
        "Gửi văn bản vào timeline chính của gateway (nhắc việc/kích hoạt).",
      agentTurnHelp:
        "Bắt đầu lượt trợ lý trong phiên riêng với prompt của bạn.",
      timeoutSeconds: "Hết giờ (giây)",
      timeoutPlaceholder: "Tùy chọn, vd. 90",
      timeoutHelp:
        "Tùy chọn. Để trống dùng mặc định timeout của gateway cho lần chạy này.",
      mainTimelineMessage: "Tin timeline chính",
      assistantTaskPrompt: "Prompt tác vụ trợ lý",
      deliverySection: "Gửi kết quả",
      deliverySub: "Chọn nơi gửi tóm tắt chạy.",
      resultDelivery: "Cách gửi kết quả",
      announceDefault: "Thông báo tóm tắt (mặc định)",
      webhookPost: "Webhook POST",
      noneInternal: "Không (nội bộ)",
      deliveryHelp:
        "Thông báo gửi tóm tắt vào chat. Không giữ thực thi nội bộ.",
      webhookUrl: "URL Webhook",
      channel: "Kênh",
      webhookPlaceholder: "https://example.com/cron",
      channelHelp: "Kênh đã kết nối nhận tóm tắt.",
      webhookHelp: "Gửi tóm tắt chạy tới endpoint webhook.",
      to: "Tới",
      toPlaceholder: "+1555... hoặc id chat",
      toHelp:
        "Ghi đè người nhận tùy chọn (id chat, số điện thoại hoặc user id).",
      advanced: "Nâng cao",
      advancedHelp:
        "Ghi đè tùy chọn cho đảm bảo gửi, jitter lịch và điều khiển model.",
      deleteAfterRun: "Xóa sau khi chạy",
      deleteAfterRunHelp: "Phù hợp nhắc một lần rồi tự dọn.",
      clearAgentOverride: "Xóa ghi đè agent",
      clearAgentHelp: "Buộc tác vụ dùng trợ lý mặc định của gateway.",
      exactTiming: "Đúng giờ (không trễ)",
      exactTimingHelp: "Chạy đúng mốc cron, không trải.",
      staggerWindow: "Cửa sổ trễ",
      staggerUnit: "Đơn vị trễ",
      staggerPlaceholder: "30",
      seconds: "Giây",
      model: "Model",
      modelPlaceholder: "openai/gpt-5.2",
      modelHelp: "Gõ để chọn model có sẵn hoặc nhập tùy chỉnh.",
      thinking: "Suy nghĩ",
      thinkingPlaceholder: "thấp",
      thinkingHelp: "Dùng mức gợi ý hoặc giá trị riêng của nhà cung cấp.",
      bestEffortDelivery: "Gửi theo khả năng tốt nhất",
      bestEffortHelp: "Không hủy tác vụ nếu bước gửi thất bại.",
      cantAddYet: "Chưa thể thêm tác vụ",
      fillRequired: "Điền các trường bắt buộc để gửi.",
      fixFields: "Sửa {count} trường để tiếp tục.",
      fixFieldsPlural: "Sửa {count} trường để tiếp tục.",
      saving: "Đang lưu...",
      saveChanges: "Lưu thay đổi",
      addJob: "Thêm tác vụ",
      cancel: "Hủy",
    },
    jobList: {
      allJobs: "mọi tác vụ",
      selectJob: "(chọn tác vụ)",
      enabled: "bật",
      disabled: "tắt",
      edit: "Sửa",
      clone: "Nhân bản",
      disable: "Tắt",
      enable: "Bật",
      run: "Chạy",
      history: "Lịch sử",
      remove: "Xóa",
    },
    jobDetail: {
      system: "Hệ thống",
      prompt: "Prompt",
      delivery: "Gửi",
      agent: "Agent",
    },
    jobState: {
      status: "Trạng thái",
      next: "Tiếp",
      last: "Trước",
    },
    runEntry: {
      noSummary: "Không có tóm tắt.",
      runAt: "Chạy lúc",
      openRunChat: "Mở chat lần chạy",
      next: "Tiếp {rel}",
      due: "Đến hạn {rel}",
    },
    errors: {
      nameRequired: "Cần có tên.",
      scheduleAtInvalid: "Nhập ngày/giờ hợp lệ.",
      everyAmountInvalid: "Khoảng phải lớn hơn 0.",
      cronExprRequired: "Cần biểu thức cron.",
      staggerAmountInvalid: "Độ trễ phải lớn hơn 0.",
      systemTextRequired: "Cần văn bản hệ thống.",
      agentMessageRequired: "Cần tin nhắn agent.",
      timeoutInvalid: "Nếu đặt, timeout phải > 0 giây.",
      webhookUrlRequired: "Cần URL webhook.",
      webhookUrlInvalid: "URL webhook phải bắt đầu bằng http:// hoặc https://.",
      invalidRunTime: "Thời gian chạy không hợp lệ.",
      invalidIntervalAmount: "Khoảng không hợp lệ.",
      cronExprRequiredShort: "Cần biểu thức cron.",
      invalidStaggerAmount: "Độ trễ không hợp lệ.",
      systemEventTextRequired: "Cần văn bản sự kiện hệ thống.",
      agentMessageRequiredShort: "Cần tin agent.",
      nameRequiredShort: "Cần tên.",
    },
  },
  channels: {
    page: {
      healthTitle: "Sức khỏe kênh",
      healthSub: "Ảnh chụp trạng thái kênh từ gateway.",
      noSnapshot: "Chưa có ảnh chụp.",
    },
    cardSub: {
      generic: "Trạng thái và cấu hình kênh.",
      whatsapp: "Liên kết WhatsApp Web và theo dõi sức khỏe kết nối.",
      telegram: "Trạng thái bot và cấu hình kênh.",
      discord: "Trạng thái bot và cấu hình kênh.",
      slack: "Trạng thái socket mode và cấu hình kênh.",
      signal: "Trạng thái signal-cli và cấu hình kênh.",
      imessage: "Trạng thái cầu nối macOS và cấu hình kênh.",
      googlechat: "Trạng thái webhook Chat API và cấu hình kênh.",
      nostr: "Tin nhắn riêng phi tập trung qua relay Nostr (NIP-04).",
    },
    labels: {
      configured: "Đã cấu hình",
      running: "Đang chạy",
      connected: "Đã kết nối",
      linked: "Đã liên kết",
      lastConnect: "Kết nối lần cuối",
      lastMessage: "Tin nhắn cuối",
      authAge: "Tuổi xác thực",
      lastInbound: "Nhận lần cuối",
      lastStart: "Khởi động lần cuối",
      lastProbe: "Thử lần cuối",
      credential: "Chứng chỉ",
      audience: "Đối tượng",
      publicKey: "Khóa công khai",
      mode: "Chế độ",
      baseUrl: "URL gốc",
      name: "Tên",
      displayName: "Tên hiển thị",
      about: "Giới thiệu",
      nip05: "NIP-05",
      profile: "Hồ sơ",
    },
    status: {
      yes: "Có",
      no: "Không",
      active: "Hoạt động",
    },
    config: {
      schemaUnavailableRaw: "Không có schema. Dùng Raw.",
      schemaUnavailableChannel: "Không tải được schema cấu hình kênh.",
      loadingSchema: "Đang tải schema cấu hình…",
      save: "Lưu",
      saving: "Đang lưu…",
      reload: "Tải lại",
    },
    actions: {
      probe: "Thử kết nối",
      refresh: "Làm mới",
      showQr: "Hiện mã QR",
      working: "Đang xử lý…",
      relink: "Liên kết lại",
      waitForScan: "Chờ quét",
      logout: "Đăng xuất",
    },
    probe: {
      lead: "Thử kết nối",
      ok: "thành công",
      failed: "thất bại",
      suffix: " ·",
    },
    whatsappQrAlt: "Mã QR WhatsApp",
    accounts: {
      count: "Tài khoản ({count})",
    },
    agentPanel: {
      title: "Kênh",
      sub: "Ảnh chụp trạng thái kênh trên toàn gateway.",
      refreshing: "Đang làm mới…",
      lastRefresh: "Làm mới lần cuối:",
      never: "chưa có",
      loadHint: "Tải kênh để xem trạng thái trực tiếp.",
      noneFound: "Không thấy kênh nào.",
      connectedOf: "{connected}/{total} đã kết nối",
      noAccounts: "không có tài khoản",
      configuredCount: "{n} đã cấu hình",
      notConfigured: "chưa cấu hình",
      enabledCount: "{n} đã bật",
      disabled: "đã tắt",
      setupGuide: "Hướng dẫn thiết lập",
      workspaceSub: "Không gian làm việc, danh tính và cấu hình model.",
    },
    nostr: {
      editProfile: "Sửa hồ sơ",
      noProfileHint:
        "Chưa có hồ sơ. Nhấn «Sửa hồ sơ» để thêm tên, giới thiệu và ảnh đại diện.",
      profilePictureAlt: "Ảnh đại diện",
    },
  },
  agents: {
    toolbarLabel: "Agent",
    badgeDefault: "mặc định",
    noAgents: "Không có agent",
    copyAgentId: "Sao chép ID agent",
    setAsDefault: "Đặt làm mặc định",
    alreadyDefault: "Đã là mặc định",
    loading: "Đang tải…",
    emptyTitle: "Chọn một agent",
    emptySub: "Chọn agent để xem không gian làm việc và công cụ.",
    cronTab: "Tác vụ Cron",
    configActions: {
      reload: "Tải lại cấu hình",
      save: "Lưu",
      saving: "Đang lưu…",
    },
    context: {
      title: "Ngữ cảnh agent",
      workspace: "Không gian làm việc",
      primaryModel: "Model chính",
      identityName: "Tên danh tính",
      identityAvatar: "Ảnh đại diện",
      skillsFilter: "Bộ lọc kỹ năng",
      defaultFlag: "Mặc định",
      allSkills: "mọi kỹ năng",
      skillsSelected: "Đã chọn {count}",
      cronSubtitle: "Không gian làm việc và mục tiêu lịch chạy.",
    },
    scheduler: {
      title: "Lịch chạy",
      sub: "Trạng thái cron trên gateway.",
      enabledStat: "Đã bật",
      jobsStat: "Tác vụ",
      nextWake: "Lần đánh thức tiếp",
    },
    cronCard: {
      title: "Cron của agent",
      sub: "Tác vụ đã lên lịch cho agent này.",
      noJobs: "Chưa gán tác vụ nào.",
      runNow: "Chạy ngay",
      chipEnabled: "đã bật",
      chipDisabled: "đã tắt",
    },
    files: {
      title: "Tệp lõi",
      sub: "Persona khởi tạo, danh tính và hướng dẫn công cụ.",
      workspacePrefix: "Không gian làm việc:",
      loadHint: "Tải tệp workspace của agent để chỉnh hướng dẫn lõi.",
      noFiles: "Không thấy tệp.",
      selectToEdit: "Chọn một tệp để sửa.",
      previewTitle: "Xem trước markdown đã render",
      preview: "Xem trước",
      reset: "Đặt lại",
      save: "Lưu",
      saving: "Đang lưu…",
      content: "Nội dung",
      missingHint: "Tệp này chưa có. Lưu sẽ tạo tệp trong workspace của agent.",
      close: "Đóng",
      missingStatus: "Thiếu",
      missingBadge: "thiếu",
    },
    overview: {
      title: "Tổng quan",
      sub: "Đường dẫn workspace và siêu dữ liệu danh tính.",
      openFilesTab: "Mở tab Tệp",
      unsaved: "Bạn có thay đổi cấu hình chưa lưu.",
      modelSelection: "Chọn model",
      primaryModelDefault: "Model chính (mặc định)",
      primaryModel: "Model chính",
      inheritDefaultWith: "Kế thừa mặc định ({model})",
      inheritDefault: "Kế thừa mặc định",
      fallbacks: "Dự phòng",
      fallbackPlaceholder: "provider/model",
    },
    tools: {
      title: "Quyền truy cập công cụ",
      subLead: "Hồ sơ + ghi đè từng công cụ cho agent này.",
      enabledSummary: "{enabled}/{total} đã bật.",
      enableAll: "Bật tất cả",
      disableAll: "Tắt tất cả",
      loadConfigHint: "Tải cấu hình gateway để chỉnh hồ sơ công cụ.",
      allowlistHint:
        "Agent này dùng allowlist rõ ràng trong cấu hình. Ghi đè công cụ quản lý ở tab Cấu hình.",
      globalAllowHint:
        "Đã đặt tools.allow toàn cục. Ghi đè agent không thể bật công cụ bị chặn toàn cục.",
      catalogLoading: "Đang tải danh mục công cụ runtime…",
      catalogFallback:
        "Không tải được danh mục runtime. Đang dùng danh sách dự phòng tích hợp.",
      profileLabel: "Hồ sơ",
      sourceLabel: "Nguồn",
      statusLabel: "Trạng thái",
      unsaved: "chưa lưu",
      quickPresets: "Cài nhanh",
      inherit: "Kế thừa",
      sourceAgent: "ghi đè agent",
      sourceGlobal: "mặc định toàn cục",
      sourceDefault: "mặc định",
      sections: {
        fs: "Tệp",
        runtime: "Thời gian chạy",
        web: "Web",
        memory: "Bộ nhớ",
        sessions: "Phiên",
        ui: "Giao diện",
        messaging: "Tin nhắn",
        automation: "Tự động hóa",
        nodes: "Nodes",
        agents: "Agent",
        media: "Đa phương tiện",
      },
      descriptions: {
        read: "Đọc nội dung tệp",
        write: "Tạo hoặc ghi đè tệp",
        edit: "Chỉnh sửa chính xác",
        apply_patch: "Vá tệp (OpenAI)",
        exec: "Chạy lệnh shell",
        process: "Quản lý tiến trình nền",
        web_search: "Tìm kiếm web",
        web_fetch: "Lấy nội dung web",
        memory_search: "Tìm kiếm ngữ nghĩa",
        memory_get: "Đọc tệp bộ nhớ",
        sessions_list: "Liệt kê phiên",
        sessions_history: "Lịch sử phiên",
        sessions_send: "Gửi tới phiên",
        sessions_spawn: "Tạo agent con",
        sessions_yield: "Kết thúc lượt để nhận kết quả từ agent con",
        subagents: "Quản lý agent con",
        session_status: "Trạng thái phiên",
        browser: "Điều khiển trình duyệt web",
        canvas: "Điều khiển canvas",
        message: "Gửi tin nhắn",
        cron: "Lên lịch tác vụ",
        gateway: "Điều khiển gateway",
        nodes: "Nodes và thiết bị",
        agents_list: "Liệt kê agent",
        image: "Hiểu ảnh",
        image_generate: "Ảnh tạo sinh",
        tts: "Chuyển đổi văn bản thành giọng nói",
      },
      profiles: {
        minimal: "Tối giản",
        coding: "Lập trình",
        messaging: "Tin nhắn",
        full: "Đầy đủ",
      },
    },
    skills: {
      title: "Kỹ năng",
      subLead: "Allowlist kỹ năng theo agent và kỹ năng trong workspace.",
      pageSubtitle: "Kỹ năng đã cài và trạng thái.",
      browseStore: "Cửa hàng kỹ năng (ClawHub)",
      browseStoreTitle: "Xem kỹ năng trên ClawHub",
      notConnectedGateway: "Chưa kết nối gateway.",
      enable: "Bật",
      disable: "Tắt",
      installing: "Đang cài…",
      saveKey: "Lưu khóa",
      apiKey: "Khóa API",
      chipEligible: "đủ điều kiện",
      chipBlocked: "bị chặn",
      chipDisabled: "đã tắt",
      chipBundled: "đi kèm",
      reasonDisabled: "đã tắt",
      reasonBlockedByAllowlist: "bị chặn bởi allowlist",
      toggleAria: "Bật hoặc tắt kỹ năng: {name}",
      enableAll: "Bật tất cả",
      disableAll: "Tắt tất cả",
      resetTitle: "Bỏ allowlist theo agent và dùng mọi kỹ năng",
      reset: "Đặt lại",
      loadConfigHint: "Tải cấu hình gateway để đặt kỹ năng theo agent.",
      allowlistActive: "Agent này dùng allowlist kỹ năng tùy chỉnh.",
      allEnabledHint:
        "Mọi kỹ năng đang bật. Tắt một kỹ năng sẽ tạo allowlist theo agent.",
      loadReportHint: "Tải kỹ năng cho agent này để xem mục riêng workspace.",
      filter: "Lọc",
      filterPlaceholder: "Tìm kỹ năng",
      shown: "{count} hiển thị",
      noneFound: "Không thấy kỹ năng.",
      missingPrefix: "Thiếu:",
      reasonPrefix: "Lý do:",
      groups: {
        workspace: "Kỹ năng workspace",
        "built-in": "Kỹ năng tích hợp",
        installed: "Kỹ năng đã cài",
        extra: "Kỹ năng bổ sung",
        other: "Kỹ năng khác",
      },
    },
  },
  nodes: {
    common: {
      loading: "Đang tải…",
      saving: "Đang lưu…",
      save: "Lưu",
    },
    list: {
      title: "Nodes",
      subtitle: "Thiết bị đã ghép cặp và liên kết trực tiếp.",
      empty: "Không tìm thấy node nào.",
      unknown: "không rõ",
      paired: "đã ghép cặp",
      unpaired: "chưa ghép cặp",
      connected: "đã kết nối",
    },
    devices: {
      title: "Thiết bị",
      subtitle: "Yêu cầu ghép cặp và token vai trò.",
      pending: "Đang chờ",
      paired: "Đã ghép cặp",
      empty: "Không có thiết bị đã ghép cặp.",
      repair: "sửa chữa",
      roleLabel: "vai trò",
      rolesLabel: "các vai trò",
      scopesLabel: "phạm vi",
      requested: "được yêu cầu",
      approve: "Duyệt",
      reject: "Từ chối",
      tokensLabel: "Token",
      none: "không có",
      active: "đang hoạt động",
      revoked: "đã thu hồi",
      rotate: "Đổi token",
      revoke: "Thu hồi",
    },
    binding: {
      title: "Gán exec node",
      subtitle: "Ghim agent vào node cụ thể khi dùng exec host=node.",
      rawModeHint:
        "Chuyển tab Cấu hình sang chế độ Form để sửa binding tại đây.",
      loadHint: "Tải cấu hình để chỉnh binding.",
      loadConfig: "Tải cấu hình",
      defaultTitle: "Binding mặc định",
      defaultSubtitle: "Dùng khi agent không ghi đè node binding.",
      nodeField: "Node",
      anyNode: "Bất kỳ node",
      noRunnableNodes: "Không có node nào hỗ trợ system.run.",
      defaultAgent: "agent mặc định",
      usesDefault: "dùng mặc định ({value})",
      override: "ghi đè: {value}",
      bindingField: "Binding",
      useDefault: "Dùng mặc định",
      any: "bất kỳ",
    },
    approvals: {
      title: "Phê duyệt exec",
      subtitle: "Allowlist và chính sách phê duyệt cho exec host=gateway/node.",
      loadHint: "Tải phê duyệt exec để chỉnh allowlist.",
      loadButton: "Tải phê duyệt",
      state: {
        on: "bật",
        off: "tắt",
      },
      security: {
        deny: "Từ chối",
        allowlist: "Allowlist",
        full: "Toàn quyền",
      },
      ask: {
        off: "Tắt",
        onMiss: "Khi thiếu",
        always: "Luôn hỏi",
      },
      target: {
        title: "Đích",
        subtitle: "Gateway sửa phê duyệt cục bộ; node sửa node đang chọn.",
        hostField: "Host",
        gateway: "Gateway",
        node: "Node",
        nodeField: "Node",
        selectNode: "Chọn node",
        empty: "Chưa có node nào công bố exec approvals.",
      },
      scope: {
        label: "Phạm vi",
        defaults: "Mặc định",
      },
      policy: {
        securityTitle: "Bảo mật",
        askTitle: "Hỏi",
        askFallbackTitle: "Phương án hỏi dự phòng",
        autoAllowTitle: "Tự cho phép CLI từ skill",
        defaultSecurity: "Chế độ bảo mật mặc định.",
        defaultAsk: "Chính sách hỏi mặc định.",
        defaultValue: "Mặc định: {value}.",
        modeField: "Chế độ",
        fallbackField: "Dự phòng",
        useDefault: "Dùng mặc định ({value})",
        useDefaultShort: "Dùng mặc định",
        askFallbackHelp: "Áp dụng khi prompt UI không khả dụng.",
        autoAllowHelp: "Cho phép tệp thực thi skill do Gateway liệt kê.",
        usingDefault: "Đang dùng mặc định ({value}).",
        override: "Ghi đè ({value}).",
      },
      allowlist: {
        title: "Allowlist",
        subtitle: "Mẫu glob không phân biệt hoa thường.",
        add: "Thêm mẫu",
        empty: "Chưa có mục allowlist.",
        never: "chưa bao giờ",
        newPattern: "Mẫu mới",
        lastUsed: "Dùng lần cuối: {value}",
        patternField: "Mẫu",
        remove: "Xóa",
      },
    },
  },
  config: {
    settingsRoot: "Cài đặt",
    categories: {
      core: "Cốt lõi",
      ai: "AI & Agent",
      communication: "Liên lạc",
      automation: "Tự động hóa",
      infrastructure: "Hạ tầng",
      appearance: "Hiển thị",
      other: "Khác",
    },
    actions: {
      unsavedRaw: "Có thay đổi chưa lưu",
      unsavedCount: "{count} thay đổi chưa lưu",
      noChanges: "Không có thay đổi",
      openPath: "Mở {path}",
      openFile: "Mở tệp cấu hình",
      open: "Mở",
      loading: "Đang tải…",
      reload: "Tải lại",
      saving: "Đang lưu…",
      save: "Lưu",
      applying: "Đang áp dụng…",
      apply: "Áp dụng",
      updating: "Đang cập nhật…",
      update: "Cập nhật",
    },
    search: {
      placeholder: "Tìm trong cài đặt...",
      sectionsAria: "Các mục cài đặt",
    },
    form: {
      schemaUnavailable: "Không có schema.",
      unsupportedSchema: "Schema không được hỗ trợ. Dùng chế độ Raw.",
      noMatch: 'Không có cài đặt nào khớp "{query}"',
      noSettingsInSection: "Không có cài đặt trong mục này",
      formUnsafeTitle: "Chế độ Form không thể sửa an toàn một số trường",
      formMode: "Form",
      rawMode: "Raw",
      loadingSchema: "Đang tải schema…",
      rawRequiredHint:
        "Cấu hình của bạn có trường mà trình sửa Form không thể biểu diễn an toàn. Hãy dùng chế độ Raw để sửa.",
      rawConfigLabel: "Cấu hình Raw (JSON/JSON5)",
      secretsStatus: "{count} bí mật {state}",
      redacted: "đã ẩn",
      visible: "đang hiện",
      revealSensitive: "Hiện giá trị nhạy cảm",
      hideSensitive: "Ẩn giá trị nhạy cảm",
      toggleRawRedaction: "Bật/tắt ẩn dữ liệu nhạy cảm trong raw config",
    },
    validity: {
      invalid:
        "Cấu hình của bạn không hợp lệ. Một số cài đặt có thể không hoạt động như mong muốn.",
      dismiss: "Không nhắc lại",
    },
    diff: {
      viewPending: "Xem {count} thay đổi chờ áp dụng",
    },
    env: {
      hideValues: "Ẩn giá trị env",
      revealValues: "Hiện giá trị env",
      peek: "Xem nhanh",
    },
    appearance: {
      title: "Hiển thị",
      themeTitle: "Giao diện",
      themeHint: "Chọn nhóm giao diện.",
      roundnessTitle: "Độ bo góc",
      roundnessHint: "Điều chỉnh độ bo góc trên toàn bộ UI.",
      square: "Vuông",
      round: "Tròn",
      connectionTitle: "Kết nối",
      gatewayLabel: "Gateway",
      statusLabel: "Trạng thái",
      connected: "Đã kết nối",
      assistantLabel: "Trợ lý",
    },
    copy: {
      hideValue: "Ẩn giá trị",
      revealValue: "Hiện giá trị",
      disableStreamModeToReveal: "Tắt stream mode để hiện giá trị",
      unsupportedSchemaNode:
        "Schema này chưa được hỗ trợ. Hãy dùng chế độ Raw.",
      unsupportedType: "Kiểu dữ liệu chưa hỗ trợ: {type}. Hãy dùng chế độ Raw.",
      resetToDefault: "Đặt lại về mặc định",
      selectPlaceholder: "Chọn...",
      jsonValue: "Giá trị JSON",
      unsupportedArraySchema:
        "Schema mảng chưa được hỗ trợ. Hãy dùng chế độ Raw.",
      item: "mục",
      items: "mục",
      add: "Thêm",
      noItemsYet: 'Chưa có mục nào. Nhấn "Thêm" để tạo.',
      removeItem: "Xóa mục",
      customEntries: "Mục tùy chỉnh",
      addEntry: "Thêm mục",
      noCustomEntries: "Chưa có mục tùy chỉnh.",
      key: "Khóa",
      removeEntry: "Xóa mục",
      random: "ngẫu nhiên",
      default: "mặc định",
      off: "tắt",
      old: "cũ",
      new: "mới",
      summarize: "tóm tắt",
      always: "luôn luôn",
      inbound: "đầu vào",
      tagged: "được gắn thẻ",
      final: "cuối cùng",
      all: "tất cả",
      session: "phiên",
      targets: "đích",
      both: "cả hai",
      raw: "thô",
      hash: "băm",
      local: "cục bộ",
      remote: "từ xa",
      rate_limit: "giới hạn tốc độ",
      overloaded: "quá tải",
      network: "mạng",
      timeout: "hết thời gian chờ",
      server_error: "lỗi máy chủ",
      wake: "đánh thức",
      agent: "agent",
      now: "ngay",
      next_heartbeat: "nhịp kế tiếp",
      none: "không",
      npm: "npm",
      archive: "gói nén",
      path: "đường dẫn",
      auto: "tự động",
      lan: "mạng nội bộ",
      loopback: "vòng lặp cục bộ",
      custom: "tùy chỉnh",
      tailnet: "tailnet",
      serve: "serve",
      funnel: "funnel",
      direct: "trực tiếp",
      ssh: "ssh",
      minimal: "tối thiểu",
      full: "đầy đủ",
      token: "token",
      password: "mật khẩu",
      trusted_proxy: "proxy tin cậy",
      aiAgents: {
        bootstrapMaxChars: {
          help: "Số ký tự tối đa của mỗi tệp bootstrap workspace được chèn vào system prompt trước khi cắt (mặc định: 20000).",
        },
        bootstrapPromptTruncationWarning: {
          help: 'Chèn cảnh báo hiển thị cho agent khi tệp bootstrap bị cắt: "off", "once" (mặc định), hoặc "always".',
        },
        bootstrapTotalMaxChars: {
          help: "Tổng số ký tự tối đa trên tất cả tệp bootstrap workspace được chèn (mặc định: 150000).",
        },
        envelopeElapsed: { help: 'Bao gồm thời gian đã trôi trong message envelope ("on" hoặc "off").' },
        envelopeTimestamp: { help: 'Bao gồm mốc thời gian tuyệt đối trong message envelope ("on" hoặc "off").' },
        envelopeTimezone: { help: 'Múi giờ cho message envelope ("utc", "local", "user", hoặc chuỗi múi giờ IANA).' },
        imageMaxDimensionPx: {
          help: "Độ dài cạnh ảnh tối đa (pixel) khi sanitize payload ảnh từ transcript/tool-result (mặc định: 1200).",
        },
        pdfMaxBytesMb: { help: "Kích thước tệp PDF tối đa theo MB cho công cụ PDF (mặc định: 10)." },
        pdfMaxPages: { help: "Số trang PDF tối đa được xử lý bởi công cụ PDF (mặc định: 20)." },
        repoRoot: {
          help: "Repo root tùy chọn hiển thị ở dòng runtime trong system prompt (ghi đè auto-detect).",
        },
        workspace: {
          help: "Đường dẫn workspace mặc định được phơi bày cho công cụ runtime của agent để có ngữ cảnh hệ tệp và hành vi nhận biết repo. Hãy đặt rõ khi chạy qua wrapper để resolution đường dẫn luôn ổn định.",
        },
        tools: {
          agentToAgentAllow: {
            help: "Danh sách cho phép ID agent đích được phép gọi bởi agent_to_agent khi orchestration bật. Dùng allowlist tường minh để tránh đồ thị gọi chéo agent mất kiểm soát.",
          },
          agentToAgentEnabled: {
            help: "Bật bề mặt công cụ agent_to_agent để một agent có thể gọi agent khác trong runtime. Giữ tắt ở triển khai đơn giản và chỉ bật khi giá trị orchestration lớn hơn độ phức tạp.",
          },
          elevatedEnabled: {
            help: "Bật đường chạy công cụ nâng quyền khi người gửi và policy đều hợp lệ. Giữ tắt ở kênh public/shared và chỉ bật cho ngữ cảnh vận hành bởi owner tin cậy.",
          },
          execAsk: {
            help: "Chiến lược phê duyệt khi lệnh exec cần xác nhận của người dùng trước khi chạy. Dùng chế độ chặt hơn ở kênh dùng chung và chế độ ít ma sát hơn ở ngữ cảnh riêng tư.",
          },
          execHost: {
            help: "Chọn chiến lược host thực thi cho lệnh shell, thường quyết định chạy local hay ủy quyền. Hãy chọn chế độ an toàn nhất nhưng vẫn đáp ứng nhu cầu tự động hóa.",
          },
          execNode: {
            help: "Cấu hình gắn node cho công cụ exec khi thực thi lệnh được ủy quyền qua node đang kết nối. Chỉ định rõ node khi thật sự cần định tuyến đa node.",
          },
          execNotifyOnExit: {
            help: 'Khi là true (mặc định), phiên exec chạy nền khi thoát và sự kiện vòng đời exec trên node sẽ enqueue system event và yêu cầu heartbeat.',
          },
          execNotifyOnExitEmptySuccess: {
            help: "Khi là true, các lần thoát exec chạy nền thành công nhưng không có output vẫn enqueue system event hoàn tất (mặc định: false).",
          },
          execPathPrepend: { help: "Danh sách thư mục prepend vào PATH cho exec runs (gateway/sandbox)." },
          execSafeBins: { help: "Cho phép safe binary chỉ-stdin chạy mà không cần mục allowlist tường minh." },
          execSafeBinTrustedDirs: {
            help: "Các thư mục tin cậy bổ sung cho kiểm tra đường dẫn safe-bin (mục PATH không bao giờ tự động được tin cậy).",
          },
          execSecurity: {
            help: "Bộ chọn tư thế bảo mật thực thi, điều khiển kỳ vọng sandbox/phê duyệt cho lệnh chạy. Giữ chế độ nghiêm ngặt cho prompt không tin cậy và chỉ nới lỏng cho workflow vận hành tin cậy.",
          },
          fsWorkspaceOnly: {
            help: "Giới hạn công cụ hệ tệp (read/write/edit/apply_patch) trong thư mục workspace (mặc định: false).",
          },
          linksEnabled: {
            help: "Bật tiền xử lý hiểu liên kết tự động để URL có thể được tóm tắt trước khi agent suy luận. Giữ bật để có ngữ cảnh giàu hơn, và tắt khi cần xử lý tối giản nghiêm ngặt.",
          },
          linksMaxLinks: {
            help: "Số liên kết tối đa được mở rộng mỗi lượt trong link understanding. Giảm để kiểm soát độ trễ/chi phí ở luồng chat dày đặc, tăng khi ngữ cảnh nhiều liên kết là quan trọng.",
          },
          linksModels: {
            help: "Danh sách mô hình ưu tiên cho tác vụ link understanding, được thử theo thứ tự fallback nếu hỗ trợ. Ưu tiên mô hình nhẹ cho tóm tắt thường quy và chỉ dùng mô hình nặng khi cần.",
          },
          linksTimeoutSeconds: {
            help: "Ngân sách timeout theo giây cho mỗi liên kết trước khi bỏ qua liên kết chưa resolve. Giữ giới hạn này để tránh treo lâu khi trang ngoài chậm hoặc không truy cập được.",
          },
          loopCriticalThreshold: { help: "Ngưỡng nghiêm trọng cho mẫu lặp khi detector bật (mặc định: 20)." },
          loopEnabled: { help: "Bật phát hiện vòng lặp tool-call lặp lại và kiểm tra an toàn backoff (mặc định: false)." },
          loopGlobalCircuitBreakerThreshold: { help: "Ngưỡng ngắt mạch toàn cục khi không tiến triển (mặc định: 30)." },
          loopHistorySize: { help: "Kích thước cửa sổ lịch sử tool cho phát hiện vòng lặp (mặc định: 30)." },
          loopWarningThreshold: { help: "Ngưỡng cảnh báo cho mẫu lặp khi detector bật (mặc định: 10)." },
          mediaConcurrency: {
            help: "Số tác vụ media understanding đồng thời tối đa mỗi lượt trên ảnh, âm thanh và video. Giảm ở môi trường hạn chế tài nguyên để tránh bão hòa CPU/mạng.",
          },
          mediaModels: {
            help: "Danh sách mô hình fallback dùng chung cho media understanding khi danh sách theo modality chưa được đặt. Căn chỉnh với provider đa phương thức sẵn có để tránh fallback churn.",
          },
          crossContextAllowAcrossProviders: { help: "Ghi đè legacy: cho phép gửi cross-context qua mọi provider." },
          sessionsVisibility: {
            help: 'Điều khiển phiên nào có thể được nhắm bởi sessions_list/sessions_history/sessions_send. ("tree" mặc định = phiên hiện tại + phiên subagent spawn; "self" = chỉ phiên hiện tại; "agent" = mọi phiên trong agent id hiện tại; "all" = mọi phiên; cross-agent vẫn cần tools.agentToAgent).',
          },
        },
        models: {
          bedrockDiscovery: {
            help: "Thiết lập khám phá tự động mô hình AWS Bedrock dùng để tổng hợp model entries của provider theo mức hiển thị của tài khoản. Giữ phạm vi khám phá hẹp và chu kỳ refresh thận trọng để giảm API churn.",
          },
        },
        sessionAgentToAgentMaxPingPongTurns: {
          help: "Số lượt phản hồi qua lại tối đa giữa requester và target agent trong trao đổi agent-to-agent (0-5). Dùng giá trị thấp để giới hạn vòng trao đổi và giữ thời gian hoàn tất dễ dự đoán.",
        },
        sessionMaintenanceHighWaterBytes: {
          help: "Dung lượng mục tiêu sau khi dọn theo ngân sách đĩa (mốc high-water). Mặc định là 80% của maxDiskBytes; đặt tường minh khi cần thu hồi chặt hơn trên đĩa hạn chế.",
        },
        sessionMaintenanceMaxDiskBytes: {
          help: "Ngân sách đĩa tùy chọn cho thư mục phiên theo từng agent (ví dụ `500mb`). Dùng để giới hạn lưu trữ phiên mỗi agent; khi vượt ngưỡng, chế độ warn chỉ báo áp lực và chế độ enforce dọn bản ghi cũ trước.",
        },
        sessionMaintenanceMaxEntries: {
          help: "Giới hạn tổng số mục phiên được giữ trong store để tránh tăng không giới hạn theo thời gian. Dùng giới hạn thấp cho môi trường hạn chế, hoặc cao hơn khi cần lịch sử dài.",
        },
        sessionMaintenanceMode: {
          help: 'Xác định chính sách bảo trì chỉ được báo cáo ("warn") hay được áp dụng thực tế ("enforce"). Giữ "warn" trong giai đoạn rollout và chuyển sang "enforce" sau khi xác nhận ngưỡng an toàn.',
        },
        sessionMaintenancePruneAfter: {
          help: "Xóa mục cũ hơn khoảng thời gian này (ví dụ `30d` hoặc `12h`) trong các lượt bảo trì. Dùng đây như điều khiển lưu giữ theo tuổi chính và đồng bộ với chính sách lưu trữ dữ liệu.",
        },
        sessionMaintenancePruneDays: {
          help: "Trường lưu giữ theo tuổi đã deprecated, giữ lại để tương thích cấu hình cũ dùng số ngày. Nên dùng session.maintenance.pruneAfter để cú pháp thời lượng và hành vi nhất quán.",
        },
        sessionMaintenanceRotateBytes: {
          help: "Xoay tệp lưu phiên khi kích thước vượt ngưỡng như `10mb` hoặc `1gb`. Dùng để giới hạn tăng trưởng tệp đơn và giữ thao tác backup/restore dễ quản lý.",
        },
        sessionResetAtHour: {
          help: "Đặt mốc giờ cục bộ (0-23) cho chế độ reset hằng ngày để phiên rollover đúng thời điểm dự đoán được. Dùng cùng mode=daily và căn theo kỳ vọng múi giờ vận hành.",
        },
        sessionResetIdleMinutes: {
          help: "Đặt cửa sổ không hoạt động trước khi reset cho chế độ idle, và cũng có thể làm hàng rào phụ cho chế độ daily. Giá trị lớn giúp giữ liên tục ngữ cảnh, nhỏ hơn cho luồng ngắn gọn mới hơn.",
        },
        sessionResetMode: {
          help: 'Chọn chiến lược reset: "daily" reset theo giờ đã cấu hình và "idle" reset sau khoảng không hoạt động. Giữ một chế độ rõ ràng cho mỗi chính sách để tránh thay đổi ngữ cảnh bất ngờ.',
        },
        sessionSendPolicyDefault: {
          help: 'Đặt hành động dự phòng khi không rule sendPolicy nào khớp: "allow" hoặc "deny". Giữ "allow" cho cấu hình đơn giản, hoặc chọn "deny" khi bạn cần rule cho phép tường minh cho mọi đích gửi.',
        },
        sessionSendPolicyRules: {
          help: 'Các rule allow/deny có thứ tự được đánh giá trước hành động mặc định, ví dụ `{ action: "deny", match: { channel: "discord" } }`. Đặt rule cụ thể nhất lên trước để rule rộng không che mất ngoại lệ.',
        },
        sessionThreadBindingsEnabled: {
          help: "Công tắc tổng toàn cục cho tính năng định tuyến phiên theo thread và hành vi gửi tập trung theo thread. Giữ bật cho workflow thread hiện đại trừ khi bạn cần tắt thread binding toàn cục.",
        },
        sessionThreadBindingsIdleHours: {
          help: "Cửa sổ không hoạt động mặc định theo giờ cho phiên gắn thread trên các provider/kênh (0 sẽ tắt auto-unfocus do idle). Mặc định: 24.",
        },
        sessionThreadBindingsMaxAgeHours: {
          help: "Giới hạn tuổi tối đa tùy chọn theo giờ cho phiên gắn thread trên các provider/kênh (0 sẽ tắt hard cap). Mặc định: 0.",
        },
        heartbeatDirectPolicy: {
          help: 'Kiểm soát việc heartbeat có được phép gửi tới chat trực tiếp/DM hay không: "allow" (mặc định) cho phép gửi DM và "block" chặn gửi tới đích trực tiếp.',
        },
        heartbeatSuppressToolErrorWarnings: {
          help: "Ẩn payload cảnh báo lỗi công cụ trong các lần chạy heartbeat.",
        },
        heartbeatTarget: {
          help: 'Đích gửi ("last", "none", hoặc id kênh).',
        },
        heartbeatTargetKnownChannels: {
          help: 'Đích gửi ("last", "none", hoặc id kênh). Các kênh đã biết: telegram, whatsapp, discord, irc, googlechat, slack, signal, imessage, line.',
        },
      },
      update: {
        auto: "Tự động",
        performance: "hiệu năng",
        advanced: "nâng cao",
        betaCheckHours: {
          label: "Chu kỳ kiểm tra bản Beta (giờ)",
          help: "Tần suất kiểm tra kênh beta theo giờ (mặc định: 1).",
        },
        enabled: {
          label: "Bật tự động cập nhật",
          help: "Tự động tải gói cập nhật khi rảnh (mặc định: true).",
        },
        stableDelayHours: {
          label: "Độ trễ cập nhật Stable (giờ)",
          help: "Độ trễ tối thiểu trước khi tự áp dụng kênh stable (mặc định: 6).",
        },
        stableJitterHours: {
          label: "Độ dàn trải Stable (giờ)",
          help: "Khoảng dàn trải rollout kênh stable theo giờ (mặc định: 12).",
        },
        channel: {
          label: "Kênh cập nhật",
          help: 'Kênh cập nhật cho GUI + runtime ("stable", "beta", "dev")',
        },
      },
      cli: {
        label: "CLI",
        help: "Điều khiển hiển thị CLI cho đầu ra lệnh cục bộ như banner và tagline.",
      },
      diagnostics: {
        label: "Chẩn đoán",
        help: "Thiết lập chẩn đoán cho trace có mục tiêu, xuất telemetry và kiểm tra cache khi debug.",
        flagsLabel: "Cờ chẩn đoán",
        flagsHelp:
          'Bật log chẩn đoán theo cờ (ví dụ: ["telegram.http"]). Hỗ trợ wildcard như "telegram.*" hoặc "*".',
      },
      acp: {
        label: "ACP",
        help: "Điều khiển runtime ACP: bật dispatch, chọn backend, và tinh chỉnh luồng phản hồi.",
      },
      mcp: {
        label: "MCP",
        help: "Định nghĩa máy chủ MCP toàn cục do OpenClaw quản lý.",
      },
      secrets: {
        label: "Bí mật",
      },
      logs: {
        label: "Nhật ký",
        customRedactionPatterns: {
          label: "Mẫu che dữ liệu tùy chỉnh",
          help: "Các mẫu regex che dữ liệu bổ sung áp dụng cho log trước khi xuất/lưu.",
        },
      },
      infrastructure: {
        gateway: {
          http: {
            help: "Nhóm cấu hình Gateway HTTP API cho bật/tắt endpoint và mức phơi bày API ở tầng vận chuyển. Chỉ bật những endpoint thật sự cần để giảm bề mặt tấn công.",
          },
          push: {
            help: "Thiết lập push-delivery dùng bởi gateway khi cần đánh thức hoặc thông báo cho thiết bị đã ghép nối. Cấu hình relay-backed APNs tại đây cho bản iOS chính thức; xác thực APNs trực tiếp vẫn dựa trên biến môi trường cho bản local/manual.",
          },
          reload: {
            help: "Chính sách nạp lại cấu hình trực tiếp quy định cách áp dụng chỉnh sửa và khi nào cần restart toàn bộ. Giữ hành vi hybrid để an toàn vận hành trừ khi đang debug chi tiết cơ chế reload.",
          },
          remote: {
            help: "Thiết lập kết nối gateway từ xa cho transport trực tiếp hoặc SSH khi instance này proxy sang máy runtime khác. Chỉ dùng chế độ remote khi chủ đích triển khai mô hình tách host.",
          },
          tailscale: {
            help: "Thiết lập tích hợp Tailscale cho phơi bày Serve/Funnel và xử lý vòng đời khi gateway khởi động/thoát. Giữ tắt nếu triển khai của bạn không chủ đích dùng ingress qua Tailscale.",
          },
          tls: {
            help: "Thiết lập chứng chỉ và khóa TLS để kết thúc HTTPS trực tiếp trong tiến trình gateway. Dùng chứng chỉ rõ ràng ở môi trường production và tránh phơi bày plaintext trên mạng không tin cậy.",
          },
        },
        nodeHost: {
          browserProxy: {
            help: "Nhóm thiết lập browser-proxy để phơi bày điều khiển trình duyệt local qua định tuyến node. Chỉ bật khi workflow node từ xa thực sự cần dùng profile trình duyệt local của bạn.",
          },
        },
        web: {
          reconnect: {
            help: "Chính sách backoff reconnect cho kênh web sau lỗi transport. Giữ số lần thử lại có giới hạn và chỉnh jitter phù hợp để tránh hiện tượng reconnect đồng loạt.",
          },
        },
        browser: {
          profiles: {
            help: "Ánh xạ profile trình duyệt có tên để định tuyến rõ ràng tới cổng hoặc URL CDP cùng metadata tùy chọn. Giữ tên profile nhất quán và tránh định nghĩa endpoint chồng chéo.",
          },
          extensionRelayBind: {
            help: "Địa chỉ IP bind cho listener relay của tiện ích mở rộng Chrome. Để trống để chỉ truy cập loopback; hoặc đặt IP non-loopback rõ ràng như 0.0.0.0 chỉ khi relay cần truy cập xuyên namespace mạng (ví dụ WSL2) và vùng mạng xung quanh đã được tin cậy.",
          },
          snapshotDefaults: {
            help: "Cấu hình mặc định cho chụp snapshot khi caller không truyền tùy chọn snapshot cụ thể. Tinh chỉnh mục này để hành vi chụp ổn định giữa các kênh và luồng tự động hóa.",
          },
          ssrfPolicy: {
            help: "Thiết lập guardrail chống SSRF cho các luồng browser/network fetch có thể chạm tới host nội bộ. Giữ mặc định nghiêm ngặt ở production và chỉ mở cho các mục tiêu được phê duyệt rõ ràng.",
          },
        },
        discovery: {
          mdns: {
            help: "Nhóm cấu hình mDNS discovery cho quảng bá mạng local và tinh chỉnh hành vi khám phá. Giữ chế độ minimal cho LAN thông thường trừ khi cần thêm metadata.",
          },
          wideArea: {
            help: "Nhóm cấu hình wide-area discovery để phơi bày tín hiệu khám phá vượt ngoài phạm vi link-local. Chỉ bật khi triển khai của bạn chủ đích tổng hợp hiện diện gateway đa site.",
          },
        },
      },
    },
    sections: {
      env: {
        label: "Biến môi trường",
        description: "Biến môi trường truyền vào tiến trình gateway",
      },
      update: {
        label: "Cập nhật",
        description: "Thiết lập tự cập nhật và kênh phát hành",
      },
      agents: {
        label: "Agent",
        description: "Cấu hình agent, mô hình và danh tính",
      },
      auth: { label: "Xác thực", description: "Khóa API và hồ sơ xác thực" },
      channels: {
        label: "Kênh",
        description: "Các kênh nhắn tin (Telegram, Discord, Slack, ...)",
      },
      messages: {
        label: "Tin nhắn",
        description: "Thiết lập xử lý và định tuyến tin nhắn",
      },
      commands: { label: "Lệnh", description: "Các lệnh chéo tùy chỉnh" },
      hooks: { label: "Hook", description: "Webhook và điểm móc sự kiện" },
      skills: { label: "Kỹ năng", description: "Gói kỹ năng và năng lực" },
      tools: {
        label: "Công cụ",
        description: "Cấu hình công cụ (trình duyệt, tìm kiếm, ...)",
      },
      gateway: {
        label: "Gateway",
        description: "Thiết lập máy chủ gateway (cổng, xác thực, liên kết)",
      },
      wizard: {
        label: "Trình thiết lập",
        description: "Trạng thái và lịch sử trình thiết lập",
      },
      meta: {
        label: "Siêu dữ liệu",
        description: "Siêu dữ liệu gateway và thông tin phiên bản",
      },
      logging: { label: "Nhật ký", description: "Mức log và cấu hình đầu ra" },
      browser: {
        label: "Trình duyệt",
        description: "Thiết lập tự động hóa trình duyệt",
      },
      ui: { label: "Giao diện", description: "Tùy chọn giao diện người dùng" },
      models: {
        label: "Mô hình",
        description: "Cấu hình mô hình AI và nhà cung cấp",
      },
      bindings: {
        label: "Ràng buộc",
        description: "Phím tắt và ràng buộc phím",
      },
      broadcast: {
        label: "Phát sóng",
        description: "Thiết lập phát sóng và thông báo",
      },
      audio: {
        label: "Âm thanh",
        description: "Thiết lập đầu vào/đầu ra âm thanh",
      },
      session: {
        label: "Phiên",
        description: "Quản lý phiên và lưu trữ trạng thái",
      },
      cron: { label: "Cron", description: "Tác vụ định kỳ và tự động hóa" },
      web: { label: "Web", description: "Thiết lập máy chủ web và API" },
      discovery: { label: "Khám phá", description: "Khám phá dịch vụ và mạng" },
      canvasHost: {
        label: "Máy chủ Canvas",
        description: "Hiển thị và dựng canvas",
      },
      talk: { label: "Thoại", description: "Thiết lập giọng nói và hội thoại" },
      plugins: {
        label: "Tiện ích mở rộng",
        description: "Quản lý plugin và mở rộng",
      },
      memory: { label: "Bộ nhớ", description: "Thiết lập bộ nhớ" },
      approvals: {
        label: "Phê duyệt",
        description: "Chính sách phê duyệt và danh sách cho phép",
      },
      nodeHost: {
        label: "Máy chủ Node",
        description: "Thiết lập môi trường chạy node host",
      },
      media: { label: "Phương tiện", description: "Thiết lập xử lý media" },
    },
    fields: {
      update: {
        checkOnStart: {
          label: "Kiểm tra cập nhật khi khởi động",
          help: "Kiểm tra cập nhật npm khi gateway khởi động (mặc định: true).",
        },
        auto: {
          enabled: {
            label: "Bật tự động cập nhật",
            help: "Bật cập nhật nền khi cài đặt gói npm (mặc định: false).",
          },
          stableDelayHours: {
            label: "Độ trễ tự động cập nhật kênh stable (giờ)",
            help: "Độ trễ tối thiểu trước khi bắt đầu tự áp dụng kênh stable (mặc định: 6).",
          },
        },
      },
      messages: {
        label: "Tin nhắn",
        help: "Thiết lập hành vi tiền tố, chat nhóm, hàng đợi và phản hồi trạng thái cho tin nhắn.",
        messagePrefix: {
          label: "Tiền tố tin nhắn",
          help: "Tiền tố thêm trước tin nhắn đầu vào khi tạo prompt xử lý.",
        },
        responsePrefix: {
          label: "Tiền tố phản hồi",
          help: "Tiền tố thêm trước nội dung phản hồi gửi ra kênh.",
        },
        groupChat: {
          label: "Chat nhóm",
          help: "Thiết lập cách xử lý tin nhắn trong ngữ cảnh nhóm.",
          mentionPatterns: {
            label: "Mẫu nhắc tên",
            help: "Danh sách pattern nhắc tên dùng để kích hoạt phản hồi trong nhóm.",
          },
          historyLimit: {
            label: "Giới hạn lịch sử nhóm",
            help: "Số tin lịch sử nhóm giữ lại làm ngữ cảnh.",
          },
        },
        queue: {
          label: "Hàng đợi tin nhắn",
          help: "Thiết lập xếp hàng, debounce và giới hạn cho xử lý tin nhắn đến.",
          mode: {
            label: "Chế độ hàng đợi",
            help: "Chế độ hoạt động của hàng đợi tin nhắn.",
          },
          byChannel: {
            label: "Theo kênh",
            help: "Ghi đè hàng đợi theo từng kênh.",
          },
          debounceMs: {
            label: "Debounce mặc định (ms)",
            help: "Thời gian debounce mặc định cho hàng đợi.",
          },
          debounceMsByChannel: {
            label: "Debounce theo kênh (ms)",
            help: "Ghi đè debounce theo từng kênh.",
          },
          cap: {
            label: "Sức chứa hàng đợi",
            help: "Số mục tối đa trong hàng đợi trước khi áp dụng chính sách drop.",
          },
          drop: {
            label: "Chính sách drop",
            help: "Chính sách loại bớt mục khi hàng đợi đầy.",
          },
        },
        inbound: {
          label: "Tin nhắn đầu vào",
          help: "Thiết lập xử lý tin nhắn đầu vào theo kênh và debounce.",
          byChannel: {
            label: "Đầu vào theo kênh",
            help: "Ghi đè xử lý đầu vào theo từng kênh.",
          },
          debounceMs: {
            label: "Debounce đầu vào (ms)",
            help: "Thời gian debounce cho tin nhắn đầu vào.",
          },
        },
        tts: {
          label: "TTS",
          help: "Thiết lập chuyển văn bản thành giọng nói cho phản hồi.",
          auto: {
            label: "Tự động TTS",
            help: "Khi nào tự động đọc phản hồi bằng giọng nói.",
          },
          mode: {
            label: "Chế độ phát TTS",
            help: "Đọc chỉ phản hồi cuối (`final`) hoặc tất cả phản hồi (`all`).",
          },
          provider: {
            label: "Nhà cung cấp TTS",
            help: "Nhà cung cấp TTS chính; có fallback tự động khi cần.",
          },
          summaryModel: {
            label: "Model tóm tắt TTS",
            help: "Mô hình dùng để tóm tắt khi nội dung quá dài trước khi đọc TTS.",
          },
          modelOverrides: {
            label: "Ghi đè từ model",
            help: "Cho phép mô hình tự đề xuất/ghi đè tham số TTS theo chính sách.",
            enabled: {
              label: "Bật ghi đè từ model",
              help: "Công tắc tổng cho cơ chế ghi đè tham số TTS từ mô hình.",
            },
            allowText: {
              label: "Cho phép ghi đè văn bản",
              help: "Cho phép mô hình cung cấp đoạn văn bản chuyên dùng cho TTS.",
            },
            allowProvider: {
              label: "Cho phép ghi đè nhà cung cấp",
              help: "Cho phép mô hình đổi nhà cung cấp TTS (mặc định nên tắt để ổn định).",
            },
            allowVoice: {
              label: "Cho phép ghi đè giọng",
              help: "Cho phép mô hình đổi `voice`/`voiceId`.",
            },
            allowModelId: {
              label: "Cho phép ghi đè model ID",
              help: "Cho phép mô hình đổi mô hình TTS.",
            },
            allowVoiceSettings: {
              label: "Cho phép ghi đè cài đặt giọng",
              help: "Cho phép mô hình đổi các tham số tinh chỉnh giọng (stability/speed/...).",
            },
            allowNormalization: {
              label: "Cho phép ghi đè chuẩn hóa",
              help: "Cho phép mô hình đổi cài đặt chuẩn hóa văn bản hoặc ngôn ngữ.",
            },
            allowSeed: {
              label: "Cho phép ghi đè seed",
              help: "Cho phép mô hình ghi đè seed cho các nhà cung cấp hỗ trợ.",
            },
          },
          edge: {
            label: "Edge (cũ)",
            help: "Bí danh cũ cho cấu hình Microsoft TTS (vẫn hỗ trợ để tương thích).",
            enabled: {
              label: "Bật Edge TTS",
              help: "Cho phép dùng Microsoft/Edge TTS không cần API key.",
            },
            voice: {
              label: "Giọng Edge",
              help: "Giọng mặc định cho provider Edge/Microsoft.",
            },
            lang: {
              label: "Ngôn ngữ Edge",
              help: "Mã ngôn ngữ mặc định cho giọng Edge/Microsoft.",
            },
            outputFormat: {
              label: "Định dạng xuất Edge",
              help: "Định dạng âm thanh đầu ra cho Edge/Microsoft TTS.",
            },
            pitch: {
              label: "Cao độ Edge",
              help: "Điều chỉnh cao độ giọng Edge/Microsoft.",
            },
            rate: {
              label: "Tốc độ đọc Edge",
              help: "Điều chỉnh tốc độ đọc giọng Edge/Microsoft.",
            },
            volume: {
              label: "Âm lượng Edge",
              help: "Điều chỉnh âm lượng giọng Edge/Microsoft.",
            },
            saveSubtitles: {
              label: "Lưu phụ đề Edge",
              help: "Lưu phụ đề kèm file âm thanh khi dùng Edge/Microsoft.",
            },
            proxy: {
              label: "Proxy Edge",
              help: "URL proxy dùng cho yêu cầu mạng Edge/Microsoft TTS.",
            },
            timeoutMs: {
              label: "Thời gian chờ Edge (ms)",
              help: "Thời gian chờ cho yêu cầu Edge/Microsoft TTS (ms).",
            },
          },
          microsoft: {
            label: "Microsoft",
            help: "Cấu hình nhà cung cấp giọng nói Microsoft.",
            enabled: {
              label: "Bật Microsoft TTS",
              help: "Cho phép dùng Microsoft TTS không cần API key.",
            },
            voice: {
              label: "Giọng Microsoft",
              help: "Giọng mặc định cho Microsoft TTS.",
            },
            lang: {
              label: "Ngôn ngữ Microsoft",
              help: "Mã ngôn ngữ mặc định cho giọng Microsoft.",
            },
            outputFormat: {
              label: "Định dạng xuất Microsoft",
              help: "Định dạng âm thanh đầu ra cho Microsoft TTS.",
            },
            pitch: {
              label: "Cao độ Microsoft",
              help: "Điều chỉnh cao độ giọng Microsoft.",
            },
            rate: {
              label: "Tốc độ đọc Microsoft",
              help: "Điều chỉnh tốc độ đọc giọng Microsoft.",
            },
            volume: {
              label: "Âm lượng Microsoft",
              help: "Điều chỉnh âm lượng giọng Microsoft.",
            },
            saveSubtitles: {
              label: "Lưu phụ đề Microsoft",
              help: "Lưu phụ đề kèm file âm thanh khi dùng Microsoft.",
            },
            proxy: {
              label: "Proxy Microsoft",
              help: "URL proxy dùng cho yêu cầu mạng Microsoft TTS.",
            },
            timeoutMs: {
              label: "Thời gian chờ Microsoft (ms)",
              help: "Thời gian chờ cho yêu cầu Microsoft TTS (ms).",
            },
          },
          openai: {
            label: "OpenAI",
            help: "Cấu hình nhà cung cấp OpenAI TTS.",
            apiKey: {
              label: "Khóa API OpenAI",
              help: "Khóa API dùng cho OpenAI TTS.",
            },
            baseUrl: {
              label: "URL gốc OpenAI",
              help: "URL endpoint gốc cho OpenAI TTS (có thể là proxy tương thích).",
            },
            model: {
              label: "Mô hình OpenAI TTS",
              help: "Mô hình TTS dùng để tổng hợp giọng nói.",
            },
            voice: {
              label: "Giọng OpenAI",
              help: "Tên giọng mặc định của OpenAI TTS.",
            },
            speed: {
              label: "Tốc độ OpenAI",
              help: "Tốc độ phát giọng OpenAI (0.25 - 4.0).",
            },
            instructions: {
              label: "Chỉ dẫn OpenAI TTS",
              help: "Chỉ dẫn hệ thống cho model TTS khi provider hỗ trợ.",
            },
          },
          prefsPath: {
            label: "Đường dẫn prefs TTS",
            help: "Đường dẫn file JSON lưu tùy chọn TTS cục bộ.",
          },
          maxTextLength: {
            label: "Độ dài văn bản tối đa",
            help: "Giới hạn ký tự tối đa gửi tới TTS.",
          },
          timeoutMs: {
            label: "Thời gian chờ TTS (ms)",
            help: "Thời gian chờ chung cho yêu cầu TTS (ms).",
          },
        },
        removeAckAfterReply: {
          label: "Xóa ack sau phản hồi",
          help: "Xóa trạng thái ack sau khi đã gửi phản hồi.",
        },
        suppressToolErrors: {
          label: "Ẩn lỗi công cụ",
          help: "Ẩn lỗi công cụ khỏi phản hồi gửi tới người dùng cuối.",
        },
        ackReaction: {
          label: "Emoji xác nhận (ack)",
          help: "Emoji phản ứng dùng để xác nhận tin đến (để trống để tắt).",
        },
        ackReactionScope: {
          label: "Phạm vi phản ứng ack",
          help: "Phạm vi áp dụng phản ứng xác nhận tin nhắn.",
        },
        statusReactions: {
          label: "Phản ứng trạng thái",
          help: "Thiết lập emoji phản ứng theo trạng thái xử lý tin nhắn.",
          enabled: {
            label: "Bật phản ứng trạng thái",
            help: "Bật/tắt emoji phản ứng theo trạng thái.",
          },
          emojis: {
            label: "Emoji trạng thái",
            help: "Bộ emoji cho các trạng thái (đang xử lý/thành công/lỗi...).",
          },
          timing: {
            label: "Thời điểm phản ứng",
            help: "Khi nào áp dụng/cập nhật phản ứng trạng thái.",
          },
        },
      },
      broadcast: {
        label: "Phát sóng",
        help: "Thiết lập map phát một tin tới nhiều đích và cách gửi tới các đích đó.",
        strategy: {
          label: "Chiến lược gửi phát sóng",
          help: "parallel gửi đồng thời; sequential gửi tuần tự.",
        },
      },
      audio: {
        label: "Âm thanh",
        help: "Thiết lập ghi âm/chuyển lời nói thành văn bản dùng cho luồng thoại.",
        transcription: {
          label: "Chuyển âm thanh thành văn bản",
          help: "Thiết lập command và timeout cho bộ chuyển âm thanh sang text.",
          command: {
            label: "Lệnh chuyển âm thanh",
            help: "Lệnh + tham số dùng để chạy bộ chuyển âm thanh.",
          },
          timeoutSeconds: {
            label: "Timeout chuyển âm thanh (giây)",
            help: "Thời gian timeout cho lệnh chuyển âm thanh.",
          },
        },
      },
      talk: {
        label: "Thoại",
        help: "Thiết lập giọng nói cho chế độ Talk: giọng, model, định dạng và ngắt lời.",
        provider: {
          label: "Nhà cung cấp thoại",
          help: "ID provider thoại đang hoạt động (ví dụ elevenlabs).",
        },
        providers: {
          label: "Danh sách provider thoại",
          help: "Cấu hình thoại theo từng provider.",
        },
        voiceId: {
          label: "ID giọng",
          help: "ID giọng mặc định cho chế độ Talk.",
        },
        voiceAliases: {
          label: "Bí danh giọng",
          help: "Map bí danh giọng cho chỉ thị thoại.",
        },
        modelId: {
          label: "Model thoại",
          help: "Model ID mặc định dùng cho tổng hợp giọng nói.",
        },
        outputFormat: {
          label: "Định dạng đầu ra thoại",
          help: "Định dạng âm thanh đầu ra cho Talk mode.",
        },
        apiKey: {
          label: "Khóa API thoại",
          help: "Khóa API dùng cho provider thoại.",
        },
        interruptOnSpeech: {
          label: "Ngắt khi người dùng bắt đầu nói",
          help: "Nếu bật, dừng giọng trợ lý khi phát hiện người dùng bắt đầu nói.",
        },
        silenceTimeoutMs: {
          label: "Timeout im lặng (ms)",
          help: "Thời gian im lặng trước khi chốt transcript và gửi.",
        },
      },
      wizard: {
        label: "Trình Thiết Lập",
        help: "Theo dõi trạng thái chạy gần nhất của trình thiết lập để hỗ trợ kiểm tra và khắc phục sự cố.",
        lastRunAt: {
          label: "Thời điểm chạy gần nhất",
          help: "Mốc thời gian ISO của lần chạy trình thiết lập gần nhất trên máy này.",
        },
        lastRunVersion: {
          label: "Phiên bản chạy gần nhất",
          help: "Phiên bản OpenClaw được ghi nhận ở lần chạy trình thiết lập gần nhất.",
        },
        lastRunCommit: {
          label: "Commit chạy gần nhất",
          help: "Mã commit nguồn được ghi nhận cho lần chạy trình thiết lập gần nhất (build dev).",
        },
        lastRunCommand: {
          label: "Lệnh chạy gần nhất",
          help: "Lệnh đã được dùng để chạy trình thiết lập gần nhất.",
        },
        lastRunMode: {
          label: "Chế độ chạy gần nhất",
          help: "Chế độ chạy trình thiết lập gần nhất (`local` hoặc `remote`).",
        },
      },
      ui: {
        label: "Giao diện",
        help: "Tùy chỉnh hiển thị giao diện như màu nhấn và thông tin trợ lý.",
        seamColor: {
          label: "Màu nhấn",
          help: "Màu chủ đạo dùng cho điểm nhấn giao diện như badge và trạng thái.",
        },
        assistant: {
          label: "Hiển thị trợ lý",
          help: "Thiết lập tên và avatar hiển thị của trợ lý trong giao diện.",
          name: {
            label: "Tên trợ lý",
            help: "Tên hiển thị của trợ lý trong các màn hình UI.",
          },
          avatar: {
            label: "Avatar trợ lý",
            help: "Nguồn ảnh avatar của trợ lý (URL/đường dẫn/data URI tùy runtime hỗ trợ).",
          },
        },
      },
      agents: {
        label: "Agent",
        help: "Cấu hình runtime agent gồm mặc định và danh sách agent cụ thể.",
        defaults: {
          label: "Mặc định agent",
          help: "Thiết lập mặc định dùng chung cho agent nếu không ghi đè theo từng agent.",
          workspace: {
            label: "Workspace",
            help: "Đường dẫn workspace mặc định được phơi bày cho công cụ runtime của agent để có ngữ cảnh hệ tệp và hành vi nhận biết repo. Hãy đặt rõ khi chạy qua wrapper để resolution đường dẫn luôn ổn định.",
          },
          repoRoot: {
            label: "Gốc repo",
            help: "Repo root tùy chọn hiển thị ở dòng runtime trong system prompt (ghi đè auto-detect).",
          },
          bootstrapMaxChars: {
            label: "Số ký tự tối đa mỗi tệp bootstrap",
            help: "Số ký tự tối đa của mỗi tệp bootstrap workspace được chèn vào system prompt trước khi cắt (mặc định: 20000).",
          },
          bootstrapTotalMaxChars: {
            label: "Tổng số ký tự bootstrap tối đa",
            help: "Tổng số ký tự tối đa trên tất cả tệp bootstrap workspace được chèn (mặc định: 150000).",
          },
          bootstrapPromptTruncationWarning: {
            label: "Cảnh báo khi cắt prompt bootstrap",
            help: 'Chèn cảnh báo hiển thị cho agent khi tệp bootstrap bị cắt: "off", "once" (mặc định), hoặc "always".',
          },
          envelopeTimezone: {
            label: "Múi giờ envelope",
            help: 'Múi giờ cho message envelope ("utc", "local", "user", hoặc chuỗi múi giờ IANA).',
          },
          envelopeTimestamp: {
            label: "Dấu thời gian envelope",
            help: 'Bao gồm mốc thời gian tuyệt đối trong message envelope ("on" hoặc "off").',
          },
          envelopeElapsed: {
            label: "Thời gian đã trôi trong envelope",
            help: 'Bao gồm thời gian đã trôi trong message envelope ("on" hoặc "off").',
          },
          imageMaxDimensionPx: {
            label: "Cạnh ảnh tối đa (px)",
            help: "Độ dài cạnh ảnh tối đa (pixel) khi sanitize payload ảnh từ transcript/tool-result (mặc định: 1200).",
          },
          pdfMaxBytesMb: {
            label: "Dung lượng PDF tối đa (MB)",
            help: "Kích thước tệp PDF tối đa theo MB cho công cụ PDF (mặc định: 10).",
          },
          pdfMaxPages: {
            label: "Số trang PDF tối đa",
            help: "Số trang PDF tối đa được xử lý bởi công cụ PDF (mặc định: 20).",
          },
        },
        list: {
          label: "Danh sách agent",
          help: "Danh sách agent và các ghi đè riêng theo từng agent.",
        },
      },
      memory: {
        label: "Bộ nhớ",
        help: "Thiết lập hệ thống bộ nhớ, backend và lập chỉ mục QMD.",
        backend: {
          label: "Backend bộ nhớ",
          help: "Backend bộ nhớ chính dùng cho truy xuất/ngữ cảnh.",
        },
        citations: {
          label: "Chế độ trích dẫn bộ nhớ",
          help: "Cách hiển thị trích dẫn khi dùng dữ liệu bộ nhớ.",
        },
        qmd: {
          label: "QMD",
          command: { label: "Lệnh QMD", help: "Đường dẫn binary/lệnh QMD." },
          searchMode: {
            label: "Chế độ tìm kiếm QMD",
            help: "Chế độ tìm kiếm dùng trong QMD.",
          },
          includeDefaultMemory: {
            label: "Bao gồm bộ nhớ mặc định",
            help: "Bao gồm nguồn bộ nhớ mặc định khi truy vấn QMD.",
          },
          paths: {
            label: "Đường dẫn QMD bổ sung",
            help: "Danh sách đường dẫn bổ sung để QMD quét dữ liệu.",
          },
          sessions: {
            label: "Lập chỉ mục phiên QMD",
            enabled: {
              label: "Bật lập chỉ mục phiên",
              help: "Bật lập chỉ mục dữ liệu phiên cho QMD.",
            },
            exportDir: {
              label: "Thư mục xuất phiên",
              help: "Thư mục xuất dữ liệu phiên để QMD xử lý.",
            },
            retentionDays: {
              label: "Lưu giữ phiên (ngày)",
              help: "Số ngày giữ dữ liệu phiên QMD.",
            },
          },
          update: {
            label: "Cập nhật QMD",
            interval: {
              label: "Chu kỳ cập nhật",
              help: "Chu kỳ chạy cập nhật chỉ mục QMD.",
            },
            debounceMs: {
              label: "Debounce cập nhật (ms)",
              help: "Khoảng debounce trước khi chạy cập nhật QMD.",
            },
            onBoot: {
              label: "Cập nhật khi khởi động",
              help: "Tự chạy cập nhật QMD lúc khởi động.",
            },
            waitForBootSync: {
              label: "Chờ đồng bộ khi khởi động",
              help: "Đợi đồng bộ QMD hoàn tất trước khi tiếp tục luồng boot.",
            },
            embedInterval: {
              label: "Chu kỳ nhúng",
              help: "Chu kỳ chạy tác vụ embed dữ liệu QMD.",
            },
            commandTimeoutMs: {
              label: "Timeout lệnh (ms)",
              help: "Timeout cho lệnh QMD.",
            },
            updateTimeoutMs: {
              label: "Timeout cập nhật (ms)",
              help: "Timeout cho tác vụ cập nhật QMD.",
            },
            embedTimeoutMs: {
              label: "Timeout embed (ms)",
              help: "Timeout cho tác vụ embed QMD.",
            },
          },
          limits: {
            label: "Giới hạn QMD",
            maxResults: {
              label: "Kết quả tối đa",
              help: "Số kết quả QMD tối đa.",
            },
            maxSnippetChars: {
              label: "Ký tự snippet tối đa",
              help: "Giới hạn ký tự snippet trả về.",
            },
            maxInjectedChars: {
              label: "Ký tự inject tối đa",
              help: "Giới hạn ký tự được inject vào ngữ cảnh.",
            },
            timeoutMs: {
              label: "Timeout tìm kiếm (ms)",
              help: "Timeout truy vấn tìm kiếm QMD.",
            },
          },
          scope: { label: "Phạm vi QMD", help: "Phạm vi bề mặt áp dụng QMD." },
          mcporter: {
            label: "MCPorter",
            enabled: {
              label: "Bật MCPorter",
              help: "Bật tích hợp MCPorter cho QMD.",
            },
            serverName: {
              label: "Tên máy chủ MCPorter",
              help: "Tên server MCPorter dùng cho QMD.",
            },
            startDaemon: {
              label: "Khởi chạy daemon MCPorter",
              help: "Tự khởi chạy daemon MCPorter khi cần.",
            },
          },
        },
      },
      tools: {
        label: "Công cụ",
        help: "Chính sách truy cập công cụ toàn cục cho web, exec, media, liên kết và quyền nâng cao.",
        allow: {
          label: "Danh sách cho phép công cụ",
          help: "Danh sách công cụ được phép toàn cục.",
        },
        deny: {
          label: "Danh sách chặn công cụ",
          help: "Danh sách công cụ bị chặn toàn cục.",
        },
        web: {
          label: "Công cụ Web",
          help: "Thiết lập công cụ tìm kiếm và web fetch.",
        },
        exec: {
          label: "Công cụ Exec",
          help: "Thiết lập thực thi lệnh shell, bảo mật và phê duyệt.",
        },
        media: {
          label: "Công cụ Media",
          help: "Thiết lập hiểu ảnh/audio/video.",
        },
        links: {
          label: "Công cụ liên kết",
          help: "Thiết lập hiểu liên kết tự động.",
        },
        profile: {
          label: "Hồ sơ công cụ",
          help: "Hồ sơ chính sách công cụ mặc định.",
        },
        alsoAllow: {
          label: "Bổ sung danh sách cho phép",
          help: "Danh sách công cụ cho phép cộng thêm.",
        },
        byProvider: {
          label: "Chính sách theo provider",
          help: "Ghi đè cho phép/chặn công cụ theo provider.",
        },
        elevated: {
          label: "Quyền công cụ nâng cao",
          help: "Thiết lập quyền dùng công cụ đặc quyền.",
        },
        subagents: {
          label: "Chính sách công cụ subagent",
          help: "Chính sách công cụ riêng cho subagent.",
        },
        sandbox: {
          label: "Chính sách công cụ sandbox",
          help: "Chính sách công cụ khi chạy trong sandbox.",
        },
        loopDetection: {
          label: "Phát hiện vòng lặp công cụ",
          help: "Thiết lập phát hiện lặp tool-call và ngắt an toàn.",
        },
        agentToAgent: {
          label: "Công cụ agent-to-agent",
          help: "Chính sách cho phép agent gọi agent khác.",
        },
        sessions: {
          label: "Hiển thị công cụ phiên",
          help: "Thiết lập hiển thị các công cụ liên quan tới phiên.",
        },
        fs: {
          label: "Công cụ hệ tệp",
          help: "Thiết lập giới hạn công cụ hệ tệp theo workspace.",
        },
      },
      models: {
        label: "Mô hình",
        help: "Thiết lập danh mục mô hình và nhà cung cấp mô hình.",
        mode: {
          label: "Chế độ danh mục mô hình",
          help: "Chế độ quản lý danh mục mô hình.",
        },
        providers: {
          label: "Nhà cung cấp mô hình",
          help: "Danh sách provider mô hình và cấu hình kết nối.",
        },
        bedrockDiscovery: {
          label: "Khám phá Bedrock",
          enabled: {
            label: "Bật khám phá Bedrock",
            help: "Bật cơ chế tự khám phá mô hình Bedrock.",
          },
          region: {
            label: "Vùng Bedrock",
            help: "Region dùng cho khám phá Bedrock.",
          },
          providerFilter: {
            label: "Bộ lọc provider Bedrock",
            help: "Bộ lọc provider khi quét Bedrock.",
          },
          refreshInterval: {
            label: "Chu kỳ làm mới (giây)",
            help: "Chu kỳ làm mới danh sách mô hình Bedrock.",
          },
          defaultContextWindow: {
            label: "Cửa sổ ngữ cảnh mặc định",
            help: "Context window mặc định cho mô hình Bedrock mới.",
          },
          defaultMaxTokens: {
            label: "Max tokens mặc định",
            help: "Giới hạn max tokens mặc định khi khám phá Bedrock.",
          },
        },
      },
      session: {
        label: "Phiên",
        help: "Thiết lập phạm vi phiên, reset, ràng buộc luồng và bảo trì dữ liệu phiên.",
        scope: { label: "Phạm vi phiên", help: "Phạm vi định danh phiên." },
        dmScope: {
          label: "Phạm vi DM",
          help: "Phạm vi phiên cho hội thoại DM.",
        },
        identityLinks: {
          label: "Liên kết danh tính",
          help: "Liên kết danh tính giữa các bề mặt hội thoại.",
        },
        resetTriggers: {
          label: "Điều kiện reset",
          help: "Các điều kiện kích hoạt reset phiên.",
        },
        idleMinutes: {
          label: "Số phút rảnh",
          help: "Ngưỡng phút không hoạt động của phiên.",
        },
        reset: {
          label: "Chính sách reset",
          help: "Chính sách reset phiên theo thời gian/chế độ.",
        },
        resetByType: {
          label: "Reset theo loại chat",
          help: "Ghi đè hành vi reset theo loại chat (trực tiếp, nhóm, thread) khi mặc định chưa đủ. Dùng khi lưu lượng nhóm/thread cần nhịp reset khác tin nhắn trực tiếp.",
          direct: {
            label: "Reset phiên (trò chuyện trực tiếp)",
            help: "Định nghĩa chính sách reset cho chat trực tiếp và thay thế cấu hình session.reset cơ sở cho loại đó. Dùng đây như ghi đè tin nhắn trực tiếp chuẩn thay cho bí danh dm cũ.",
          },
          dm: {
            label: "Reset phiên (bí danh DM đã ngừng dùng)",
            help: "Bí danh đã ngừng dùng cho hành vi reset trực tiếp, giữ để tương thích cấu hình cũ. Hãy dùng session.resetByType.direct để tooling và validation sau này nhất quán.",
          },
          group: {
            label: "Reset phiên (nhóm)",
            help: "Định nghĩa chính sách reset cho phiên chat nhóm khi tính liên tục và mẫu nhiễu khác DM. Dùng cửa sổ rảnh ngắn hơn cho nhóm đông nếu trôi ngữ cảnh trở thành vấn đề.",
          },
          thread: {
            label: "Reset phiên (thread)",
            help: "Định nghĩa chính sách reset cho phiên phạm vi thread, gồm luồng thread kênh tập trung. Dùng khi phiên thread cần hết hạn nhanh hoặc chậm hơn các loại chat khác.",
          },
        },
        resetByChannel: {
          label: "Reset theo kênh",
          help: "Ghi đè reset theo từng kênh.",
        },
        store: {
          label: "Đường dẫn lưu phiên",
          help: "Đường dẫn tệp/thư mục lưu dữ liệu phiên.",
        },
        typingIntervalSeconds: {
          label: "Chu kỳ typing (giây)",
          help: "Chu kỳ gửi trạng thái typing.",
        },
        typingMode: { label: "Chế độ typing", help: "Chế độ hiển thị typing." },
        parentForkMaxTokens: {
          label: "Max token khi tách nhánh",
          help: "Giới hạn token khi tách phiên từ parent.",
        },
        mainKey: {
          label: "Khóa phiên chính",
          help: "Khóa chính dùng định tuyến phiên.",
        },
        sendPolicy: {
          label: "Chính sách gửi",
          help: "Chính sách gửi phản hồi theo rule.",
        },
        agentToAgent: {
          label: "Agent-to-agent",
          help: "Thiết lập phiên cho luồng agent gọi agent.",
        },
        threadBindings: {
          label: "Ràng buộc luồng",
          help: "Thiết lập ràng buộc phiên với thread/topic.",
        },
        maintenance: {
          label: "Bảo trì phiên",
          help: "Thiết lập dọn dẹp, xoay vòng và ngân sách lưu trữ phiên.",
        },
      },
      skills: {
        label: "Kỹ năng",
        help: "Thiết lập nạp kỹ năng và theo dõi thay đổi kỹ năng.",
        load: {
          label: "Nạp kỹ năng",
          watch: {
            label: "Theo dõi kỹ năng",
            help: "Theo dõi thay đổi tệp kỹ năng để tự nạp lại.",
          },
          watchDebounceMs: {
            label: "Debounce theo dõi (ms)",
            help: "Debounce khi phát hiện thay đổi kỹ năng.",
          },
        },
      },
      approvals: {
        label: "Phê duyệt",
        help: "Thiết lập chuyển tiếp yêu cầu phê duyệt exec tới các đích kênh ngoài phiên gốc.",
        exec: {
          label: "Chuyển tiếp phê duyệt thực thi",
          help: "Nhóm cấu hình bật/tắt, chế độ, bộ lọc và danh sách đích cho phê duyệt thực thi.",
          enabled: {
            label: "Bật chuyển tiếp phê duyệt",
            help: "Bật gửi yêu cầu phê duyệt exec tới các đích đã cấu hình.",
          },
          mode: {
            label: "Chế độ chuyển tiếp",
            help: "session: chỉ phiên gốc; targets: chỉ đích cấu hình; both: cả hai.",
          },
          agentFilter: {
            label: "Lọc theo agent",
            help: "Danh sách cho phép ID tác tử được chuyển tiếp phê duyệt.",
          },
          sessionFilter: {
            label: "Lọc theo phiên",
            help: "Mẫu khóa phiên (chuỗi con/regex) để giới hạn ngữ cảnh được chuyển tiếp.",
          },
          targets: {
            label: "Đích chuyển tiếp",
            help: "Danh sách đích nhận phê duyệt khi mode bao gồm targets.",
            channel: {
              label: "Kênh đích",
              help: "ID kênh/nhà cung cấp nhận yêu cầu phê duyệt (vd: discord, slack).",
            },
            to: {
              label: "Điểm đến",
              help: "Định danh đích trong kênh (channel ID, user ID hoặc thread root tùy provider).",
            },
            accountId: {
              label: "ID tài khoản đích",
              help: "Chọn tài khoản cụ thể trong cấu hình đa tài khoản của kênh.",
            },
            threadId: {
              label: "ID luồng đích",
              help: "Thread/topic đích cho provider hỗ trợ gửi theo luồng.",
            },
          },
        },
      },
      bindings: {
        label: "Ràng buộc",
        help: "Thiết lập ràng buộc định tuyến và sở hữu hội thoại ACP bền vững.",
      },
      commands: {
        label: "Lệnh",
        help: "Thiết lập bề mặt lệnh chat, quyền owner và quyền nâng cao theo kênh.",
        native: {
          label: "Lệnh gốc",
          help: "Đăng ký lệnh slash/menu gốc với kênh hỗ trợ (Discord/Slack/Telegram).",
        },
        nativeSkills: {
          label: "Lệnh kỹ năng gốc",
          help: "Đăng ký lệnh kỹ năng ở menu lệnh gốc khi kênh hỗ trợ.",
        },
        text: {
          label: "Lệnh dạng văn bản",
          help: "Bật phân tích lệnh từ tin nhắn văn bản ngoài bề mặt lệnh gốc.",
        },
        bash: {
          label: "Cho phép lệnh Bash",
          help: "Cho phép chạy lệnh shell qua chat (`!` hoặc `/bash`).",
        },
        bashForegroundMs: {
          label: "Thời gian chạy tiền cảnh Bash (ms)",
          help: "Sau thời gian này lệnh bash sẽ chuyển chạy nền.",
        },
        config: {
          label: "Cho phép /config",
          help: "Cho phép lệnh /config đọc/ghi cấu hình trên đĩa.",
        },
        mcp: {
          label: "Cho phép /mcp",
          help: "Cho phép lệnh /mcp quản lý cấu hình MCP trong `mcp.servers`.",
        },
        plugins: {
          label: "Cho phép /plugins",
          help: "Cho phép lệnh /plugins liệt kê plugin và bật/tắt plugin trong config.",
        },
        debug: {
          label: "Cho phép /debug",
          help: "Cho phép lệnh /debug để ghi đè chỉ ở runtime.",
        },
        restart: {
          label: "Cho phép khởi động lại",
          help: "Cho phép /restart và action công cụ khởi động lại gateway.",
        },
        useAccessGroups: {
          label: "Dùng nhóm truy cập",
          help: "Áp dụng chính sách/danh sách cho phép nhóm truy cập cho lệnh.",
        },
        ownerAllowFrom: {
          label: "Danh sách chủ sở hữu",
          help: "Danh sách cho phép chủ sở hữu cho lệnh/công cụ chỉ dành cho chủ sở hữu.",
        },
        ownerDisplay: {
          label: "Kiểu hiển thị ID chủ sở hữu",
          help: "Cách hiển thị ID chủ sở hữu trong prompt hệ thống (raw/hash).",
        },
        ownerDisplaySecret: {
          label: "Bí mật băm ID chủ sở hữu",
          help: "Secret dùng HMAC khi `ownerDisplay=hash`.",
        },
        allowFrom: {
          label: "Luật quyền lệnh nâng cao",
          help: "Quy tắc cho phép quyền lệnh nâng cao theo kênh và người gửi.",
        },
      },
      hooks: {
        label: "Hook",
        help: "Bề mặt tự động hóa webhook đầu vào để ánh xạ sự kiện bên ngoài thành hành động trong OpenClaw.",
        enabled: {
          label: "Bật Hook",
          help: "Bật endpoint hook và pipeline thực thi mapping cho request webhook đến.",
        },
        path: {
          label: "Đường dẫn Hook",
          help: "Đường dẫn HTTP dùng cho endpoint hook (ví dụ `/hooks`).",
        },
        token: {
          label: "Token xác thực Hook",
          help: "Bearer token dùng để xác thực request webhook trước khi chạy mapping.",
        },
        defaultSessionKey: {
          label: "Session key mặc định",
          help: "Session key dự phòng khi request không cung cấp session key hợp lệ.",
        },
        allowRequestSessionKey: {
          label: "Cho phép session key từ request",
          help: "Cho phép caller truyền session key trong request hook khi bật.",
        },
        allowedSessionKeyPrefixes: {
          label: "Tiền tố session key cho phép",
          help: "Danh sách tiền tố session key được chấp nhận khi cho phép caller truyền key.",
        },
        allowedAgentIds: {
          label: "ID agent cho phép",
          help: "Danh sách agent mà hook mapping được phép target.",
        },
        maxBodyBytes: {
          label: "Kích thước body tối đa (bytes)",
          help: "Giới hạn kích thước payload webhook trước khi từ chối request.",
        },
        presets: {
          label: "Preset Hook",
          help: "Các gói preset hook được áp dụng khi tải cấu hình.",
        },
        transformsDir: {
          label: "Thư mục transform Hook",
          help: "Thư mục gốc chứa module transform được tham chiếu trong mapping.",
        },
        mappings: {
          label: "Ánh xạ Hook",
          help: "Danh sách rule ánh xạ theo thứ tự để match request và chọn hành động wake/agent.",
          id: {
            label: "ID ánh xạ",
            help: "Định danh ổn định cho một ánh xạ hook.",
          },
          match: {
            label: "Điều kiện khớp",
            help: "Nhóm điều kiện match của ánh xạ trước khi định tuyến hành động.",
            path: {
              label: "Đường dẫn khớp",
              help: "Điều kiện khớp theo path request inbound.",
            },
            source: {
              label: "Nguồn khớp",
              help: "Điều kiện khớp theo source do upstream/adapter gắn.",
            },
          },
          action: {
            label: "Hành động ánh xạ",
            help: "Loại hành động ánh xạ: `wake` hoặc `agent`.",
          },
          wakeMode: {
            label: "Chế độ đánh thức",
            help: "Chế độ wake: `now` hoặc `next-heartbeat`.",
          },
          name: {
            label: "Tên ánh xạ",
            help: "Tên hiển thị dễ đọc cho ánh xạ trong log/UI.",
          },
          agentId: {
            label: "ID agent",
            help: "ID agent đích cho ánh xạ khi không dùng mặc định.",
          },
          sessionKey: {
            label: "Session key",
            help: "Ghi đè session key cho tin nhắn do ánh xạ gửi.",
          },
          messageTemplate: {
            label: "Mẫu message",
            help: "Template dựng nội dung message cuối cùng cho action.",
          },
          textTemplate: {
            label: "Mẫu văn bản",
            help: "Template fallback dạng text thuần khi không cần payload giàu.",
          },
          deliver: {
            label: "Gửi phản hồi",
            help: "Quyết định có gửi kết quả ánh xạ về kênh đích hay chạy im lặng.",
          },
          allowUnsafeExternalContent: {
            label: "Cho phép nội dung ngoài không an toàn",
            help: "Cho phép ánh xạ đưa dữ liệu ngoài ít sanitize hơn vào message tạo ra.",
          },
          channel: {
            label: "Kênh gửi",
            help: "Kênh gửi phản hồi cho output của ánh xạ.",
          },
          to: {
            label: "Điểm đến gửi",
            help: "Định danh đích trong kênh đã chọn để gửi phản hồi.",
          },
          model: {
            label: "Ghi đè mô hình",
            help: "Mô hình ghi đè cho lượt chạy được kích hoạt bởi ánh xạ.",
          },
          thinking: {
            label: "Ghi đè mức suy luận",
            help: "Ghi đè mức suy luận để cân bằng độ trễ/chất lượng.",
          },
          timeoutSeconds: {
            label: "Thời gian chờ (giây)",
            help: "Thời gian chạy tối đa của hành động ánh xạ.",
          },
          transform: {
            label: "Biến đổi",
            help: "Cấu hình module/export transform để xử lý payload trước khi chạy hành động.",
            module: {
              label: "Module transform",
              help: "Đường dẫn module transform (tương đối trong transformsDir).",
            },
            export: {
              label: "Export transform",
              help: "Tên export sẽ được gọi trong module transform.",
            },
          },
        },
        gmail: {
          help: "Thiết lập tích hợp Gmail push/PubSub và callback server cục bộ.",
          account: {
            label: "Tài khoản Gmail",
            help: "Định danh tài khoản Google dùng cho watch/subscription.",
          },
          label: {
            label: "Nhãn Gmail",
            help: "Bộ lọc nhãn Gmail để giới hạn email kích hoạt hook.",
          },
          topic: {
            label: "Topic Pub/Sub",
            help: "Topic Pub/Sub nhận thông báo Gmail.",
          },
          subscription: {
            label: "Subscription Pub/Sub",
            help: "Subscription Pub/Sub dùng nhận push.",
          },
          pushToken: {
            label: "Push token Gmail",
            help: "Token xác thực push callback Gmail.",
          },
          hookUrl: {
            label: "URL callback Hook",
            help: "URL callback webhook cho Gmail push.",
          },
          includeBody: {
            label: "Bao gồm nội dung thư",
            help: "Khi bật sẽ kèm body email vào payload xử lý.",
          },
          maxBytes: {
            label: "Kích thước tối đa (bytes)",
            help: "Giới hạn kích thước body email trong payload.",
          },
          renewEveryMinutes: {
            label: "Chu kỳ gia hạn (phút)",
            help: "Khoảng thời gian gia hạn watch Gmail.",
          },
          allowUnsafeExternalContent: {
            label: "Cho phép nội dung ngoài không an toàn",
            help: "Cho phép đưa nội dung ngoài ít sanitize hơn vào message.",
          },
          serve: {
            label: "Máy chủ local Gmail Hook",
            bind: {
              label: "Địa chỉ bind",
              help: "Địa chỉ bind cho server callback local Gmail hook.",
            },
            port: {
              label: "Cổng",
              help: "Cổng server callback local Gmail hook.",
            },
            path: {
              label: "Đường dẫn",
              help: "Đường dẫn callback của server local Gmail hook.",
            },
          },
          tailscale: {
            label: "Tailscale Gmail Hook",
            mode: {
              label: "Chế độ Tailscale",
              help: "Chế độ public URL qua Tailscale cho Gmail hook.",
            },
            path: {
              label: "Đường dẫn Tailscale",
              help: "Đường dẫn callback public qua Tailscale.",
            },
            target: {
              label: "Đích Tailscale",
              help: "Đích nội bộ mà URL Tailscale chuyển tiếp tới.",
            },
          },
          model: {
            label: "Ghi đè mô hình",
            help: "Mô hình ghi đè cho lượt chạy Gmail hook.",
          },
          thinking: {
            label: "Ghi đè mức suy luận",
            help: "Mức suy luận ghi đè cho lượt chạy Gmail hook.",
          },
        },
        internal: {
          label: "Hook nội bộ",
          help: "Hook nội bộ để xử lý sự kiện runtime bằng module handler.",
          enabled: {
            label: "Bật hook nội bộ",
            help: "Bật/tắt pipeline hook nội bộ.",
          },
          handlers: {
            label: "Bộ xử lý hook nội bộ",
            event: {
              label: "Sự kiện",
              help: "Tên sự kiện nội bộ mà handler lắng nghe.",
            },
            module: { label: "Module", help: "Đường dẫn module handler." },
            export: {
              label: "Export",
              help: "Tên export handler sẽ được gọi.",
            },
          },
          entries: {
            label: "Bản ghi hook nội bộ",
            help: "Danh sách bản ghi hook nội bộ đã nạp.",
          },
          load: {
            label: "Bộ nạp hook nội bộ",
            extraDirs: {
              label: "Thư mục bổ sung",
              help: "Các thư mục bổ sung để quét hook nội bộ.",
            },
          },
          installs: {
            label: "Bản ghi cài đặt",
            help: "Metadata cài đặt hook nội bộ.",
          },
        },
      },
      plugins: {
        label: "Tiện ích mở rộng",
        help: "Thiết lập hệ thống plugin: bật/tắt, phạm vi nạp, cấu hình entry và theo dõi cài đặt.",
        enabled: {
          label: "Bật plugin",
          help: "Bật/tắt việc nạp plugin toàn cục khi khởi động và nạp lại cấu hình.",
        },
        allow: {
          label: "Danh sách cho phép plugin",
          help: "Nếu đặt, chỉ plugin có trong danh sách này mới được nạp.",
        },
        deny: {
          label: "Danh sách chặn plugin",
          help: "Plugin bị chặn tuyệt đối ngay cả khi nằm trong allowlist/đường dẫn nạp.",
        },
        load: {
          label: "Bộ nạp plugin",
          help: "Thiết lập đường dẫn file/thư mục nơi loader tìm plugin.",
          paths: {
            label: "Đường dẫn nạp plugin",
            help: "Danh sách file/thư mục plugin quét thêm ngoài mặc định.",
          },
        },
        slots: {
          label: "Khe plugin",
          help: "Chọn plugin sở hữu các slot runtime độc quyền để tránh xung đột.",
          memory: {
            label: "Plugin bộ nhớ",
            help: "Plugin bộ nhớ đang hoạt động (hoặc `none`).",
          },
          contextEngine: {
            label: "Plugin máy ngữ cảnh",
            help: "Plugin đang điều phối context engine.",
          },
        },
        entries: {
          label: "Entry plugin",
          help: "Cấu hình theo từng plugin ID gồm enablement và payload runtime riêng.",
          enabled: {
            label: "Bật plugin",
            help: "Ghi đè bật/tắt cho từng plugin entry.",
          },
          hooks: {
            label: "Chính sách hook plugin",
            allowPromptInjection: {
              label: "Cho phép hook chèn prompt",
              help: "Cho phép plugin chỉnh sửa prompt qua typed hooks.",
            },
          },
          subagent: {
            label: "Chính sách subagent plugin",
            allowModelOverride: {
              label: "Cho phép ghi đè mô hình subagent",
              help: "Cho phép plugin yêu cầu ghi đè provider/model cho subagent nền.",
            },
            allowedModels: {
              label: "Mô hình subagent cho phép",
              help: "Danh sách model đích plugin được phép ghi đè khi chạy subagent.",
            },
          },
          apiKey: {
            label: "Khóa API plugin",
            help: "API key tùy chọn dùng cho plugin cần cấu hình khóa trực tiếp.",
          },
          env: {
            label: "Biến môi trường plugin",
            help: "Map biến môi trường chỉ áp dụng trong runtime của plugin đó.",
          },
          config: {
            label: "Cấu hình plugin",
            help: "Payload cấu hình riêng theo schema/validation của plugin.",
          },
        },
        installs: {
          label: "Bản ghi cài đặt plugin",
          help: "Metadata cài đặt do CLI quản lý để cập nhật và truy vết nguồn plugin.",
          source: {
            label: "Nguồn cài đặt",
            help: "Nguồn cài đặt (`npm`, `archive`, hoặc `path`).",
          },
          spec: {
            label: "Spec cài đặt",
            help: "Spec npm gốc dùng khi cài plugin từ npm.",
          },
          sourcePath: {
            label: "Đường dẫn nguồn",
            help: "Đường dẫn archive/path gốc dùng khi cài plugin.",
          },
          installPath: {
            label: "Đường dẫn cài đặt",
            help: "Thư mục cài đặt plugin đã resolve.",
          },
          version: {
            label: "Phiên bản cài",
            help: "Phiên bản plugin tại thời điểm cài đặt.",
          },
          resolvedName: {
            label: "Tên gói đã resolve",
            help: "Tên package đã resolve từ artifact tải về.",
          },
          resolvedVersion: {
            label: "Phiên bản đã resolve",
            help: "Phiên bản package đã resolve từ artifact.",
          },
          resolvedSpec: {
            label: "Spec đã resolve",
            help: "Spec chính xác sau resolve (dạng `<name>@<version>`).",
          },
          integrity: {
            label: "Mã toàn vẹn",
            help: "Giá trị integrity của artifact npm (nếu có).",
          },
          shasum: {
            label: "Mã shasum",
            help: "Giá trị shasum của artifact npm (nếu có).",
          },
          resolvedAt: {
            label: "Thời điểm resolve",
            help: "Mốc thời gian resolve metadata package gần nhất.",
          },
          installedAt: {
            label: "Thời điểm cài đặt",
            help: "Mốc thời gian cài đặt/cập nhật plugin gần nhất.",
          },
          marketplaceName: {
            label: "Tên marketplace",
            help: "Tên hiển thị marketplace của plugin (nếu có).",
          },
          marketplaceSource: {
            label: "Nguồn marketplace",
            help: "Nguồn marketplace dùng để resolve cài đặt.",
          },
          marketplacePlugin: {
            label: "Plugin marketplace",
            help: "Tên entry plugin trong nguồn marketplace.",
          },
        },
      },
      gateway: {
        label: "Gateway",
        help: "Thiết lập runtime gateway: cổng, bind, auth, TLS, UI điều khiển và chính sách phơi bày endpoint.",
        port: { label: "Cổng Gateway", help: "Cổng TCP mà gateway lắng nghe." },
        mode: {
          label: "Chế độ Gateway",
          help: "Chế độ vận hành gateway (`local` hoặc `remote`).",
        },
        bind: {
          label: "Chế độ bind Gateway",
          help: "Kiểu bind mạng (`auto`, `lan`, `loopback`, `custom`, `tailnet`).",
        },
        customBindHost: {
          label: "Host bind tùy chỉnh",
          help: "Host/IP bind khi `gateway.bind=custom`.",
        },
        controlUi: {
          label: "UI điều khiển",
          help: "Thiết lập phục vụ Control UI từ tiến trình gateway.",
          enabled: {
            label: "Bật UI điều khiển",
            help: "Bật/tắt phục vụ Control UI.",
          },
          basePath: {
            label: "Đường dẫn gốc UI",
            help: "Base path để mount Control UI.",
          },
          root: {
            label: "Thư mục tài sản UI",
            help: "Thư mục chứa tài sản tĩnh của Control UI.",
          },
          allowedOrigins: {
            label: "Origin cho phép",
            help: "Danh sách origin được phép truy cập Control UI.",
          },
          dangerouslyAllowHostHeaderOriginFallback: {
            label: "Cho phép fallback origin theo Host header (nguy hiểm)",
            help: "Cho phép fallback xác định origin từ Host header khi thiếu origin hợp lệ.",
          },
          allowInsecureAuth: {
            label: "Cho phép auth không bảo mật",
            help: "Bật cơ chế auth ít an toàn cho môi trường phát triển/thử nghiệm.",
          },
          dangerouslyDisableDeviceAuth: {
            label: "Tắt xác thực thiết bị (nguy hiểm)",
            help: "Tắt device auth cho Control UI. Chỉ dùng khi hiểu rõ rủi ro.",
          },
        },
        auth: {
          label: "Xác thực Gateway",
          help: "Chính sách xác thực HTTP/WebSocket của gateway.",
          mode: {
            label: "Chế độ xác thực",
            help: "Chế độ auth (`none`, `token`, `password`, `trusted-proxy`).",
          },
          allowTailscale: {
            label: "Cho phép danh tính Tailscale",
            help: "Cho phép identity Tailscale thỏa điều kiện auth.",
          },
          rateLimit: {
            label: "Giới hạn tần suất auth",
            help: "Giới hạn số lần thử đăng nhập/xác thực.",
          },
          trustedProxy: {
            label: "Trusted proxy auth",
            help: "Ánh xạ header auth từ proxy tin cậy.",
          },
          token: { label: "Token Gateway", help: "Token xác thực gateway." },
          password: {
            label: "Mật khẩu Gateway",
            help: "Mật khẩu xác thực gateway.",
          },
        },
        trustedProxies: {
          label: "CIDR proxy tin cậy",
          help: "Danh sách CIDR/IP proxy được tin cậy để chuyển tiếp IP client.",
        },
        allowRealIpFallback: {
          label: "Cho phép fallback x-real-ip",
          help: "Cho phép fallback `x-real-ip` khi thiếu `x-forwarded-for`.",
        },
        tools: {
          label: "Chính sách công cụ Gateway",
          help: "Allow/deny tool ở cấp gateway.",
          allow: {
            label: "Danh sách cho phép tool",
            help: "Danh sách tool được phép ở cấp gateway.",
          },
          deny: {
            label: "Danh sách chặn tool",
            help: "Danh sách tool bị chặn ở cấp gateway.",
          },
        },
        channelHealthCheckMinutes: {
          label: "Chu kỳ kiểm tra sức khỏe kênh (phút)",
          help: "Khoảng thời gian probe sức khỏe kênh.",
        },
        channelStaleEventThresholdMinutes: {
          label: "Ngưỡng stale event kênh (phút)",
          help: "Ngưỡng phút không nhận sự kiện trước khi coi kênh stale.",
        },
        channelMaxRestartsPerHour: {
          label: "Số lần restart kênh tối đa/giờ",
          help: "Giới hạn restart kênh do health monitor trong 1 giờ.",
        },
        tailscale: {
          label: "Tailscale Gateway",
          help: "Tích hợp Tailscale cho Serve/Funnel và vòng đời khi gateway khởi động/thoát. Giữ tắt trừ khi triển khai cố ý dựa vào ingress qua Tailscale.",
          mode: {
            label: "Chế độ Tailscale",
            help: "Chế độ publish Tailscale (`off`, `serve`, `funnel`).",
          },
          resetOnExit: {
            label: "Reset Tailscale khi thoát",
            help: "Reset trạng thái Serve/Funnel khi gateway dừng.",
          },
        },
        remote: {
          label: "Gateway từ xa",
          help: "Thiết lập kết nối gateway từ xa qua transport trực tiếp hoặc SSH khi instance này proxy tới host runtime khác. Chỉ dùng chế độ remote khi đã cố ý cấu hình tách host.",
          transport: {
            label: "Transport từ xa",
            help: "Transport kết nối remote gateway (`direct` hoặc `ssh`).",
          },
          url: {
            label: "URL Gateway từ xa",
            help: "WebSocket URL của remote gateway (`ws://` hoặc `wss://`).",
          },
          sshTarget: {
            label: "Đích SSH",
            help: "Đích SSH dạng `user@host` hoặc `user@host:port`.",
          },
          sshIdentity: {
            label: "Tệp identity SSH",
            help: "Đường dẫn tệp SSH identity tùy chọn (`ssh -i`).",
          },
          token: {
            label: "Token Gateway từ xa",
            help: "Token dùng xác thực tới remote gateway.",
          },
          password: {
            label: "Mật khẩu Gateway từ xa",
            help: "Mật khẩu dùng xác thực tới remote gateway.",
          },
          tlsFingerprint: {
            label: "Vân tay TLS Gateway từ xa",
            help: "TLS fingerprint sha256 mong đợi của remote gateway.",
          },
        },
        reload: {
          label: "Nạp lại cấu hình",
          help: "Chính sách nạp lại cấu hình trực tiếp: cách áp dụng chỉnh sửa và khi nào kích hoạt khởi động lại hoàn toàn. Giữ hành vi hybrid để cập nhật vận hành an toàn nhất, trừ khi đang gỡ lỗi nội bộ cơ chế reload.",
          mode: {
            label: "Chế độ nạp lại",
            help: "Chế độ áp dụng thay đổi cấu hình runtime.",
          },
          debounceMs: {
            label: "Debounce nạp lại (ms)",
            help: "Cửa sổ debounce trước khi áp dụng thay đổi config.",
          },
          deferralTimeoutMs: {
            label: "Timeout trì hoãn restart (ms)",
            help: "Timeout tối đa cho cơ chế trì hoãn restart.",
          },
        },
        tls: {
          label: "TLS Gateway",
          help: "Chứng chỉ và khóa TLS để kết thúc HTTPS trực tiếp trong tiến trình gateway. Production dùng chứng chỉ rõ ràng; tránh lưu thông tin dạng plaintext trên mạng không tin cậy.",
          enabled: {
            label: "Bật TLS",
            help: "Bật kết nối HTTPS/WSS trực tiếp trên gateway.",
          },
          autoGenerate: {
            label: "Tự tạo chứng chỉ TLS",
            help: "Tự tạo cặp chứng chỉ/khóa TLS khi chưa cấu hình tệp.",
          },
          certPath: {
            label: "Đường dẫn chứng chỉ TLS",
            help: "Đường dẫn tệp chứng chỉ TLS.",
          },
          keyPath: {
            label: "Đường dẫn khóa TLS",
            help: "Đường dẫn tệp khóa riêng TLS.",
          },
          caPath: {
            label: "Đường dẫn CA TLS",
            help: "Đường dẫn tệp CA bundle tùy chọn.",
          },
        },
        http: {
          label: "HTTP API Gateway",
          help: "Cấu hình HTTP API của gateway: nhóm bật/tắt endpoint và kiểm soát phơi bày API phía transport. Chỉ bật endpoint thực sự cần để giảm diện tấn công.",
          endpoints: {
            label: "Endpoint HTTP",
            chatCompletions: {
              label: "Endpoint Chat Completions",
              enabled: {
                label: "Bật Chat Completions",
                help: "Bật endpoint `POST /v1/chat/completions` tương thích OpenAI.",
              },
              maxBodyBytes: {
                label: "Body tối đa (bytes)",
                help: "Kích thước body tối đa cho endpoint Chat Completions.",
              },
              maxImageParts: {
                label: "Số image part tối đa",
                help: "Số phần ảnh tối đa trong một request Chat Completions.",
              },
              maxTotalImageBytes: {
                label: "Tổng dung lượng ảnh tối đa",
                help: "Tổng bytes ảnh tối đa trong một request.",
              },
              images: {
                label: "Giới hạn ảnh",
                allowUrl: {
                  label: "Cho phép URL ảnh",
                  help: "Cho phép ảnh từ `image_url`.",
                },
                urlAllowlist: {
                  label: "Danh sách URL ảnh cho phép",
                  help: "Danh sách allow URL nguồn ảnh.",
                },
                allowedMimes: {
                  label: "MIME ảnh cho phép",
                  help: "Danh sách MIME ảnh được chấp nhận.",
                },
                maxBytes: {
                  label: "Kích thước ảnh tối đa (bytes)",
                  help: "Giới hạn bytes cho từng ảnh.",
                },
                maxRedirects: {
                  label: "Số redirect ảnh tối đa",
                  help: "Số lần redirect tối đa khi fetch ảnh URL.",
                },
                timeoutMs: {
                  label: "Timeout fetch ảnh (ms)",
                  help: "Timeout fetch ảnh URL cho Chat Completions.",
                },
              },
            },
          },
          securityHeaders: {
            label: "Header bảo mật HTTP",
            strictTransportSecurity: {
              label: "Strict-Transport-Security",
              help: "Giá trị header HSTS (hoặc `false` để tắt).",
            },
          },
        },
        push: {
          label: "Phân phối đẩy Gateway",
          apns: {
            label: "Phân phối APNs",
            relay: {
              label: "Relay APNs",
              baseUrl: {
                label: "URL gốc relay APNs",
                help: "Base URL relay APNs.",
              },
              timeoutMs: {
                label: "Timeout relay APNs (ms)",
                help: "Timeout gọi relay APNs.",
              },
            },
          },
        },
        nodes: {
          label: "Định tuyến node",
          browser: {
            label: "Trình duyệt theo node",
            mode: {
              label: "Chế độ trình duyệt node",
              help: "Chế độ định tuyến browser qua node.",
            },
            node: {
              label: "Node ghim trình duyệt",
              help: "Ghim định tuyến browser vào node cụ thể.",
            },
          },
          allowCommands: {
            label: "Danh sách lệnh node cho phép",
            help: "Lệnh bổ sung cho phép ở node.",
          },
          denyCommands: {
            label: "Danh sách lệnh node chặn",
            help: "Lệnh bị chặn ở node.",
          },
        },
      },
      nodeHost: {
        label: "Máy chủ Node",
        help: "Thiết lập tính năng node host phơi bày cho node/client khác.",
        browserProxy: {
          label: "Proxy trình duyệt Node",
          help: "Nhóm thiết lập proxy trình duyệt để phơi bày điều khiển browser local qua định tuyến node. Chỉ bật khi workflow node từ xa cần profile browser trên máy bạn.",
          enabled: {
            label: "Bật proxy trình duyệt Node",
            help: "Cho phép định tuyến browser local qua node proxy.",
          },
          allowProfiles: {
            label: "Profile cho phép",
            help: "Danh sách profile browser được phép expose qua proxy node.",
          },
        },
      },
      canvasHost: {
        label: "Máy chủ Canvas",
        help: "Thiết lập host canvas để phục vụ tài sản canvas và live reload.",
        enabled: {
          label: "Bật máy chủ Canvas",
          help: "Bật/tắt server canvas host.",
        },
        root: {
          label: "Thư mục gốc Canvas",
          help: "Thư mục gốc phục vụ file canvas.",
        },
        port: {
          label: "Cổng Canvas host",
          help: "Cổng TCP của server canvas host.",
        },
        liveReload: {
          label: "Live reload Canvas",
          help: "Bật tự động tải lại khi file canvas thay đổi.",
        },
      },
      media: {
        label: "Phương tiện",
        help: "Thiết lập xử lý media dùng chung cho provider/công cụ nhận tệp đầu vào.",
        preserveFilenames: {
          label: "Giữ nguyên tên tệp",
          help: "Giữ nguyên tên tệp media gốc thay vì đổi tên an toàn tạm.",
        },
        ttlHours: {
          label: "TTL lưu media (giờ)",
          help: "Thời gian lưu media đầu vào trước khi dọn dẹp tự động.",
        },
      },
      web: {
        label: "Web",
        help: "Thiết lập kênh Web: heartbeat và chính sách kết nối lại.",
        enabled: { label: "Bật kênh Web", help: "Bật/tắt runtime kênh Web." },
        heartbeatSeconds: {
          label: "Heartbeat kênh Web (giây)",
          help: "Chu kỳ heartbeat duy trì kết nối kênh Web.",
        },
        reconnect: {
          label: "Chính sách kết nối lại",
          help: "Chính sách backoff khi kênh Web thử kết nối lại sau lỗi transport. Giữ retry có giới hạn và jitter hợp lý để tránh hiện tượng reconnect đồng loạt (thundering herd).",
          initialMs: {
            label: "Độ trễ đầu tiên (ms)",
            help: "Độ trễ reconnect đầu tiên sau khi mất kết nối.",
          },
          maxMs: {
            label: "Độ trễ tối đa (ms)",
            help: "Giới hạn trần độ trễ reconnect.",
          },
          factor: {
            label: "Hệ số backoff",
            help: "Hệ số tăng backoff theo cấp số nhân.",
          },
          jitter: {
            label: "Độ nhiễu reconnect",
            help: "Hệ số ngẫu nhiên (0-1) cho độ trễ reconnect.",
          },
          maxAttempts: {
            label: "Số lần reconnect tối đa",
            help: "Số lần reconnect tối đa (0 là không thử lại).",
          },
        },
      },
      browser: {
        label: "Trình duyệt",
        help: "Thiết lập runtime trình duyệt cho kết nối CDP local/remote, profile và chính sách snapshot.",
        enabled: {
          label: "Bật trình duyệt",
          help: "Bật/tắt wiring khả năng trình duyệt trong gateway.",
        },
        cdpUrl: {
          label: "URL CDP",
          help: "WebSocket URL CDP để attach tới trình duyệt quản lý bên ngoài.",
        },
        color: {
          label: "Màu nhấn trình duyệt",
          help: "Màu nhận diện mặc định cho profile/trạng thái trình duyệt.",
        },
        executablePath: {
          label: "Đường dẫn file thực thi",
          help: "Đường dẫn trình duyệt khi auto-discovery không phù hợp.",
        },
        headless: {
          label: "Chế độ headless",
          help: "Ép chạy trình duyệt ở chế độ headless khi launcher local khởi chạy.",
        },
        noSandbox: {
          label: "Chế độ no-sandbox",
          help: "Tắt sandbox Chromium (giảm cách ly tiến trình).",
        },
        attachOnly: {
          label: "Chế độ chỉ attach",
          help: "Chỉ attach CDP, không tự khởi chạy trình duyệt local.",
        },
        cdpPortRangeStart: {
          label: "Cổng CDP bắt đầu",
          help: "Cổng CDP local bắt đầu cho cấp phát profile tự động.",
        },
        defaultProfile: {
          label: "Profile mặc định",
          help: "Tên profile mặc định khi caller không chỉ định profile.",
        },
        profiles: {
          label: "Profile trình duyệt",
          help: "Ánh xạ profile trình duyệt theo tên để định tuyến rõ ràng tới cổng CDP hoặc URL kèm metadata tùy chọn. Giữ tên profile thống nhất và tránh định nghĩa endpoint chồng chéo.",
          cdpPort: {
            label: "Cổng CDP profile",
            help: "Cổng CDP local theo profile.",
          },
          cdpUrl: {
            label: "URL CDP profile",
            help: "URL CDP theo profile để định tuyến remote rõ ràng.",
          },
          userDataDir: {
            label: "Thư mục dữ liệu người dùng",
            help: "Thư mục user data theo profile để attach session hiện có.",
          },
          driver: {
            label: "Driver profile",
            help: "Driver profile (`openclaw`/`clawd` hoặc `existing-session`).",
          },
          attachOnly: {
            label: "Chỉ attach theo profile",
            help: "Bỏ qua launch local, chỉ attach endpoint CDP sẵn có cho profile.",
          },
          color: {
            label: "Màu profile",
            help: "Màu nhận diện theo profile trong dashboard/UI.",
          },
        },
        evaluateEnabled: {
          label: "Bật evaluate",
          help: "Bật helper evaluate phía browser khi workflow cần.",
        },
        snapshotDefaults: {
          label: "Mặc định snapshot",
          help: "Cấu hình chụp snapshot mặc định khi caller không cung cấp tùy chọn snapshot rõ ràng. Tinh chỉnh để hành vi capture đồng nhất giữa các kênh và luồng tự động.",
          mode: {
            label: "Chế độ snapshot",
            help: "Chế độ trích xuất snapshot mặc định cho tác vụ agent.",
          },
        },
        ssrfPolicy: {
          label: "Chính sách SSRF",
          help: "Thanh chắn SSRF cho đường fetch browser/network có thể chạm tới host nội bộ. Production giữ mặc định hạn chế; chỉ mở các mục tiêu đã được phê duyệt rõ ràng.",
          allowPrivateNetwork: {
            label: "Cho phép mạng private (legacy)",
            help: "Alias cũ cho khóa dangerouslyAllowPrivateNetwork.",
          },
          dangerouslyAllowPrivateNetwork: {
            label: "Cho phép mạng private (nguy hiểm)",
            help: "Cho phép truy cập dải địa chỉ private từ công cụ browser/network.",
          },
          allowedHostnames: {
            label: "Hostname cho phép",
            help: "Danh sách hostname cho phép theo ngoại lệ SSRF.",
          },
          hostnameAllowlist: {
            label: "Allowlist hostname (legacy)",
            help: "Trường allowlist hostname dạng legacy/alternate.",
          },
        },
        remoteCdpTimeoutMs: {
          label: "Timeout kết nối remote CDP (ms)",
          help: "Timeout kết nối endpoint remote CDP.",
        },
        remoteCdpHandshakeTimeoutMs: {
          label: "Timeout handshake remote CDP (ms)",
          help: "Timeout bắt tay CDP sau khi đã kết nối.",
        },
      },
      discovery: {
        label: "Khám phá",
        help: "Thiết lập khám phá dịch vụ cho mDNS cục bộ và wide-area discovery.",
        wideArea: {
          label: "Wide-area discovery",
          help: "Nhóm cấu hình wide-area discovery để phát tín hiệu khám phá ra ngoài phạm vi local-link. Chỉ bật khi triển khai cố ý gom sự hiện diện gateway giữa nhiều site.",
          enabled: {
            label: "Bật wide-area discovery",
            help: "Bật tín hiệu khám phá ngoài phạm vi mạng cục bộ.",
          },
          domain: {
            label: "Miền wide-area discovery",
            help: "Miền DNS-SD unicast cho khám phá wide-area.",
          },
        },
        mdns: {
          label: "mDNS discovery",
          help: "Nhóm cấu hình mDNS cho quảng bá và tinh chỉnh hành vi khám phá trên mạng LAN. Giữ chế độ minimal cho khám phá LAN thường lệ trừ khi cần thêm metadata.",
          mode: {
            label: "Chế độ mDNS",
            help: "Chế độ quảng bá mDNS (`minimal`, `full`, `off`).",
          },
        },
      },
      cron: {
        label: "Cron",
        help: "Thiết lập bộ lập lịch toàn cục cho job cron, thử lại và lưu giữ lịch sử chạy.",
        enabled: {
          label: "Bật Cron",
          help: "Bật/tắt thực thi toàn bộ job cron đã lưu.",
        },
        store: {
          label: "Đường dẫn lưu Cron",
          help: "Đường dẫn file lưu trữ job cron để giữ lịch qua các lần restart.",
        },
        maxConcurrentRuns: {
          label: "Số chạy đồng thời tối đa",
          help: "Giới hạn số job cron chạy cùng lúc khi nhiều lịch kích hoạt đồng thời.",
        },
        retry: {
          label: "Chính sách thử lại Cron",
          help: "Ghi đè chính sách retry cho job one-shot khi lỗi tạm thời.",
          maxAttempts: {
            label: "Số lần thử lại tối đa",
            help: "Số lần thử lại tối đa trước khi job bị đánh dấu lỗi vĩnh viễn.",
          },
          backoffMs: {
            label: "Độ trễ thử lại (ms)",
            help: "Danh sách độ trễ (ms) cho từng lần retry.",
          },
          retryOn: {
            label: "Loại lỗi được retry",
            help: "Các loại lỗi kích hoạt retry (rate_limit, network, timeout, ...).",
          },
        },
        webhook: {
          label: "Webhook Cron cũ",
          help: "Webhook dự phòng cũ (deprecated), chỉ dùng cho job cũ có `notify=true`.",
        },
        webhookToken: {
          label: "Token bearer webhook Cron",
          help: "Token bearer gắn vào POST webhook khi dùng chế độ webhook.",
        },
        sessionRetention: {
          label: "Lưu giữ phiên Cron",
          help: "Thời gian giữ phiên chạy cron trước khi dọn dẹp (vd: `24h`, `7d`, hoặc `false`).",
        },
        runLog: {
          label: "Dọn dẹp run log Cron",
          help: "Thiết lập dọn dẹp file lịch sử chạy dưới `cron/runs/<jobId>.jsonl`.",
          maxBytes: {
            label: "Dung lượng run log tối đa",
            help: "Khi vượt ngưỡng bytes, run log sẽ được prune giữ lại phần cuối.",
          },
          keepLines: {
            label: "Số dòng run log giữ lại",
            help: "Số dòng cuối được giữ sau khi prune do vượt `maxBytes`.",
          },
        },
      },
      env: {
        label: "Biến môi trường",
        help: "Thiết lập nhập và ghi đè biến môi trường dùng để cấp biến runtime cho tiến trình gateway.",
        shellEnv: {
          label: "Biến môi trường từ shell",
          help: "Thiết lập nạp biến môi trường từ shell đăng nhập khi khởi động.",
          enabled: {
            label: "Bật nạp biến từ shell",
            help: "Bật/tắt nạp biến môi trường từ profile shell người dùng lúc khởi tạo.",
          },
          timeoutMs: {
            label: "Thời gian chờ nạp shell (ms)",
            help: "Thời gian chờ tối đa (ms) để nạp biến từ shell trước khi fallback.",
          },
        },
        vars: {
          label: "Biến ghi đè",
          help: "Map key/value biến môi trường ghi đè, được trộn vào môi trường runtime của OpenClaw.",
        },
      },
      meta: {
        label: "Siêu dữ liệu",
        help: "Các trường metadata do OpenClaw tự quản lý để theo dõi lịch sử ghi/phiên bản config.",
        lastTouchedVersion: {
          label: "Phiên bản chạm cuối",
          help: "Tự động cập nhật khi OpenClaw ghi config.",
        },
        lastTouchedAt: {
          label: "Thời điểm chạm cuối",
          help: "Mốc thời gian ISO của lần ghi config gần nhất (tự động).",
        },
      },
      cli: {
        label: "CLI",
        help: "Điều khiển hiển thị CLI cho đầu ra lệnh cục bộ như banner và kiểu tagline.",
        banner: {
          label: "Banner CLI",
          help: "Điều khiển banner khởi động CLI: dòng tiêu đề/phiên bản và kiểu tagline.",
          taglineMode: {
            label: "Chế độ tagline của banner CLI",
            help: "Chọn kiểu tagline: random (ngẫu nhiên), default (mặc định), hoặc off (tắt).",
          },
        },
      },
      diagnostics: {
        label: "Chẩn đoán",
        help: "Thiết lập chẩn đoán cho trace, telemetry và kiểm tra cache khi gỡ lỗi.",
        enabled: {
          label: "Bật chẩn đoán",
          help: "Công tắc tổng cho đầu ra chẩn đoán trong log và telemetry.",
        },
        stuckSessionWarnMs: {
          label: "Ngưỡng cảnh báo phiên treo (ms)",
          help: "Ngưỡng thời gian (ms) để cảnh báo phiên đang xử lý quá lâu.",
        },
        flags: {
          label: "Cờ chẩn đoán",
          help: 'Bật log chẩn đoán theo cờ (ví dụ: ["telegram.http"]). Hỗ trợ wildcard.',
        },
        otel: {
          label: "OpenTelemetry",
          help: "Thiết lập xuất OpenTelemetry cho trace, metrics và logs.",
          enabled: {
            label: "Bật OpenTelemetry",
            help: "Bật pipeline xuất OTel theo endpoint/protocol đã cấu hình.",
          },
          endpoint: {
            label: "Điểm cuối OpenTelemetry",
            help: "URL collector dùng để gửi telemetry OpenTelemetry.",
          },
          protocol: {
            label: "Giao thức OpenTelemetry",
            help: "Giao thức vận chuyển OTel: http/protobuf hoặc grpc.",
          },
          headers: {
            label: "Tiêu đề OpenTelemetry",
            help: "Header metadata bổ sung gửi cùng yêu cầu export OTel.",
          },
          serviceName: {
            label: "Tên dịch vụ OpenTelemetry",
            help: "Tên dịch vụ hiển thị trong telemetry resource attributes.",
          },
          traces: {
            label: "Bật trace OpenTelemetry",
            help: "Bật xuất trace tới collector OpenTelemetry đã cấu hình.",
          },
          metrics: {
            label: "Bật metrics OpenTelemetry",
            help: "Bật xuất metrics tới collector OpenTelemetry đã cấu hình.",
          },
          logs: {
            label: "Bật logs OpenTelemetry",
            help: "Bật xuất logs qua OpenTelemetry ngoài sink log cục bộ.",
          },
          sampleRate: {
            label: "Tỷ lệ lấy mẫu trace",
            help: "Tỷ lệ sampling trace (0-1) khi xuất tới hệ thống quan sát.",
          },
          flushIntervalMs: {
            label: "Chu kỳ flush OpenTelemetry (ms)",
            help: "Khoảng thời gian flush telemetry từ buffer tới collector (ms).",
          },
        },
        cacheTrace: {
          label: "Theo dõi cache",
          help: "Thiết lập cache-trace để quan sát quyết định cache và ngữ cảnh payload khi chạy embedded.",
          enabled: {
            label: "Bật cache trace",
            help: "Ghi log cache trace cho lượt chạy embedded agent (mặc định: false).",
          },
          filePath: {
            label: "Đường dẫn file cache trace",
            help: "Đường dẫn JSONL cho log cache trace.",
          },
          includeMessages: {
            label: "Bao gồm messages trong cache trace",
            help: "Bao gồm toàn bộ payload message trong trace output (mặc định: true).",
          },
          includePrompt: {
            label: "Bao gồm prompt trong cache trace",
            help: "Bao gồm nội dung prompt trong trace output (mặc định: true).",
          },
          includeSystem: {
            label: "Bao gồm system prompt trong cache trace",
            help: "Bao gồm system prompt trong trace output (mặc định: true).",
          },
        },
      },
      acp: {
        label: "ACP",
        help: "Thiết lập runtime ACP: bật dispatch, chọn backend, giới hạn agent và tinh chỉnh stream.",
        enabled: {
          label: "Bật ACP",
          help: "Công tắc tính năng ACP toàn cục.",
        },
        dispatch: {
          label: "Điều phối ACP",
          help: "Điều khiển độc lập việc thực thi lượt chạy ACP.",
          enabled: {
            label: "Bật dispatch ACP",
            help: "Bật/tắt thực thi lượt ACP (mặc định: true).",
          },
        },
        backend: {
          label: "Backend ACP",
          help: "ID backend ACP mặc định (ví dụ: acpx).",
        },
        defaultAgent: {
          label: "Agent ACP mặc định",
          help: "Agent đích mặc định khi spawn ACP không chỉ định agent.",
        },
        allowedAgents: {
          label: "Danh sách agent ACP cho phép",
          help: "Allowlist agent đích được phép dùng cho phiên ACP.",
        },
        maxConcurrentSessions: {
          label: "Số phiên ACP đồng thời tối đa",
          help: "Giới hạn số phiên ACP hoạt động cùng lúc trên gateway.",
        },
        stream: {
          label: "Luồng ACP",
          help: "Thiết lập projection stream ACP: kích thước chunk, hiển thị metadata và hành vi gửi.",
          coalesceIdleMs: {
            label: "Gộp theo thời gian rảnh (ms)",
            help: "Cửa sổ flush theo thời gian rảnh (ms) trước khi phát block reply.",
          },
          maxChunkChars: {
            label: "Số ký tự tối đa mỗi chunk",
            help: "Kích thước chunk tối đa cho projection ACP trước khi tách.",
          },
          repeatSuppression: {
            label: "Ẩn dòng lặp",
            help: "Ẩn các dòng trạng thái/công cụ ACP bị lặp trong một lượt.",
          },
          deliveryMode: {
            label: "Chế độ gửi ACP",
            help: "live: gửi dần; final_only: đệm và chỉ gửi khi kết thúc lượt.",
          },
          hiddenBoundarySeparator: {
            label: "Dấu phân cách biên ẩn",
            help: "Dấu phân cách chèn trước đoạn text thấy được tiếp theo khi có sự kiện ACP ẩn.",
          },
          maxOutputChars: {
            label: "Số ký tự output tối đa",
            help: "Số ký tự output trợ lý tối đa cho mỗi lượt ACP trước khi cắt.",
          },
          maxSessionUpdateChars: {
            label: "Số ký tự session/update tối đa",
            help: "Số ký tự tối đa cho dòng session/update được chiếu ra.",
          },
          tagVisibility: {
            label: "Hiển thị tag",
            help: "Ghi đè hiển thị theo tag cho projection ACP (ví dụ usage_update).",
          },
        },
        runtime: {
          label: "Thời gian chạy ACP",
          ttlMinutes: {
            label: "TTL runtime (phút)",
            help: "TTL rảnh (phút) của worker phiên ACP trước khi dọn.",
          },
          installCommand: {
            label: "Lệnh cài đặt runtime",
            help: "Lệnh cài đặt/thiết lập hiển thị khi backend ACP chưa sẵn sàng.",
          },
        },
      },
      mcp: {
        label: "MCP",
        help: "Định nghĩa máy chủ MCP toàn cục do OpenClaw quản lý.",
        servers: {
          label: "Máy chủ MCP",
          help: "Danh sách server MCP theo tên. OpenClaw lưu trong config riêng và adapter runtime chọn transport phù hợp khi chạy.",
        },
      },
      secrets: {
        label: "Bí mật",
        help: "Thiết lập quản lý và resolve secrets cho runtime/công cụ.",
        providers: {
          label: "Nhà cung cấp secrets",
          help: "Map nhà cung cấp secrets theo tên (env/file/exec).",
        },
        defaults: {
          label: "Mặc định secrets",
          help: "Nhà cung cấp mặc định cho từng loại nguồn secrets (env/file/exec).",
          env: {
            label: "Mặc định env",
            help: "Tên provider mặc định cho SecretRef nguồn env.",
          },
          file: {
            label: "Mặc định file",
            help: "Tên provider mặc định cho SecretRef nguồn file.",
          },
          exec: {
            label: "Mặc định exec",
            help: "Tên provider mặc định cho SecretRef nguồn exec.",
          },
        },
        resolution: {
          label: "Giải quyết secrets",
          help: "Giới hạn đồng thời và kích thước batch khi resolve secrets.",
          maxProviderConcurrency: {
            label: "Đồng thời tối đa theo provider",
            help: "Số provider có thể resolve secrets đồng thời tối đa.",
          },
          maxRefsPerProvider: {
            label: "Số refs tối đa mỗi provider",
            help: "Số SecretRef tối đa xử lý mỗi provider trong một đợt resolve.",
          },
          maxBatchBytes: {
            label: "Kích thước batch tối đa (bytes)",
            help: "Giới hạn kích thước dữ liệu batch khi resolve secrets.",
          },
        },
      },
      logging: {
        label: "Nhật ký",
        help: "Thiết lập mức log, đầu ra, format và che dữ liệu nhạy cảm.",
        level: {
          label: "Mức log chính",
          help: "Ngưỡng mức log chính cho runtime logger (silent/fatal/error/warn/info/debug/trace).",
        },
        file: {
          label: "Tệp log",
          help: "Đường dẫn tệp log lưu bền (bổ sung hoặc thay cho console).",
        },
        consoleLevel: {
          label: "Mức log console",
          help: "Ngưỡng log riêng cho đầu ra terminal.",
        },
        consoleStyle: {
          label: "Kiểu log console",
          help: "Định dạng log console: pretty, compact hoặc json.",
        },
        redactSensitive: {
          label: "Che dữ liệu nhạy cảm",
          help: "Chế độ che dữ liệu nhạy cảm trong log: off hoặc tools.",
        },
        redactPatterns: {
          label: "Mẫu che dữ liệu tùy chỉnh",
          help: "Regex che dữ liệu bổ sung áp dụng cho log trước khi xuất/lưu.",
        },
      },
      auth: {
        label: "Xác thực",
        help: "Gốc cấu hình hồ sơ xác thực cho đa profile nhà cung cấp và cơ chế failover theo cooldown.",
        profiles: {
          label: "Hồ sơ xác thực",
          help: "Danh sách hồ sơ xác thực theo tên (provider + mode + email tùy chọn).",
        },
        order: {
          label: "Thứ tự ưu tiên auth",
          help: "Thứ tự profile auth theo từng provider (dùng cho failover tự động).",
        },
        cooldowns: {
          label: "Cooldown xác thực",
          help: "Thiết lập cooldown/backoff để tạm thời bỏ qua profile lỗi do billing và điều khiển nhịp thử lại.",
          billingBackoffHours: {
            label: "Backoff billing cơ bản (giờ)",
            help: "Backoff cơ bản (giờ) khi profile lỗi do billing/thiếu credits (mặc định: 5).",
          },
          billingBackoffHoursByProvider: {
            label: "Backoff billing theo provider (giờ)",
            help: "Ghi đè backoff billing theo từng provider.",
          },
          billingMaxHours: {
            label: "Giới hạn backoff billing (giờ)",
            help: "Giới hạn tối đa backoff billing theo giờ (mặc định: 24).",
          },
          failureWindowHours: {
            label: "Cửa sổ tính lỗi (giờ)",
            help: "Cửa sổ thời gian (giờ) dùng để tính bộ đếm backoff lỗi (mặc định: 24).",
          },
        },
      },
    },
  },
};

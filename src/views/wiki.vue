<template>
  <div class="wiki-view">
    <!-- 右侧导航 -->
    <div class="side-nav" :class="{ collapsed: isNavCollapsed }">
      <button class="toggle-btn" @click="toggleNav" :title="isNavCollapsed ? '展开导航' : '收起导航'">
        {{ isNavCollapsed ? '◀' : '▶' }}
      </button>
      <div class="nav-content">
        <button class="nav-btn" @click="scrollTo('basic-info')">基础资料</button>
        <button class="nav-btn" @click="scrollTo('other-info')">其他信息</button>
        <button class="nav-btn" @click="scrollTo('stats')">角色统计</button>
        <button class="nav-btn" @click="scrollTo('battle-style')">战斗风格</button>
        <button class="nav-btn" @click="scrollTo('skill-desc')">技能说明</button>
        <button class="nav-btn" @click="scrollTo('skill-intro')">技能介绍</button>
        <button class="nav-btn top-btn" @click="scrollTo('top')" title="返回顶部">▲</button>
      </div>
    </div>

    <!-- 顶部 Banner -->
    <div id="top" class="banner-section" :style="{ backgroundImage: `url(${currentBanner})` }">
      <div class="banner-actions">
        <button class="banner-btn" @click="scrollTo('basic-info')">基础资料</button>
        <button class="banner-btn" @click="scrollTo('skill-intro')">角色养成</button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="content-section">
      <!-- 模块：基础资料 -->
      <div id="basic-info" class="module glass-panel">
        <h2 class="module-title">基础资料</h2>

        <!-- 角色展示组件 -->
        <div class="role-component">
          <div class="role-wrapper">
            <div class="role-bg" :style="{ backgroundImage: `url(${roleBg})` }"></div>
            <div class="role-content">
              <!-- 角色立绘切换 -->
              <div class="role-images">
                <div class="figure" :class="{ 'figure-visible': activeImageTab === 0 }">
                  <img :src="roleImages[0]" alt="达妮娅" />
                </div>
                <div class="figure" :class="{ 'figure-visible': activeImageTab === 1 }">
                  <img :src="roleImages[1]" alt="编队立绘" />
                </div>
                <div class="figure" :class="{ 'figure-visible': activeImageTab === 2 }">
                  <img :src="roleImages[2]" alt="海报立绘" />
                </div>
              </div>
              <!-- 角色信息 -->
              <div class="role-profile">
                <div class="main-info">
                  <img class="attr-icon" :src="attrIcon" alt="热熔" />
                  <div class="name-block">
                    <h2 class="name">达妮娅</h2>
                    <div class="name-en">DENIA</div>
                  </div>
                </div>
                <img class="hr-line" src="https://wiki.kurobbs.com/resource/wiki/prod/assets/profile-hr-line-8e485eed.png" alt="" />
                <div class="lore-block">
                  <h3 class="lore-title">共鸣能力：泡影视阈</h3>
                  <p class="lore-desc">星炬学院虚质科学部学生，终日懒散摸鱼打瞌睡。 出席过绝大多数学生活动，常用"温柔"的笑容面对大家。</p>
                </div>
                <div class="tags-block">
                  <span class="tag">性别：女</span>
                  <span class="tag">出生：█ █</span>
                  <span class="tag">武器：音感仪</span>
                  <span class="tag">属性：热熔</span>
                </div>
              </div>
              <!-- 立绘切换标签 -->
              <div class="role-tabs">
                <div class="role-tab" :class="{ active: activeImageTab === 0 }" @click="activeImageTab = 0">
                  <span>基础信息</span>
                </div>
                <div class="role-tab" :class="{ active: activeImageTab === 1 }" @click="activeImageTab = 1">
                  <span>编队立绘</span>
                </div>
                <div class="role-tab" :class="{ active: activeImageTab === 2 }" @click="activeImageTab = 2">
                  <span>海报立绘</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 其他信息 -->
        <div id="other-info" class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
            <div class="component-header-content">
              <span class="component-title-text">其他信息</span>
              <button class="collapse-btn" @click="toggleCollapse('otherInfo')">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.otherInfo">
            <table class="info-table">
              <colgroup><col style="width:35%"/><col style="width:65%"/></colgroup>
              <tbody>
                <tr><td class="label-cell">身份</td><td class="value-cell">星炬学院虚质科学部学生</td></tr>
                <tr><td class="label-cell">所属</td><td class="value-cell"><s>残星会</s></td></tr>
                <tr><td class="label-cell">特殊料理</td><td class="value-cell"><a href="https://wiki.kurobbs.com/mc/item/1498831545168896000" target="_blank">夺目甜蜜</a></td></tr>
                <tr><td class="label-cell">中文CV</td><td class="value-cell">戈昕宇</td></tr>
                <tr><td class="label-cell">日文CV</td><td class="value-cell">伊藤美来</td></tr>
                <tr><td class="label-cell">英文CV</td><td class="value-cell">Jodie Bell Cortez</td></tr>
                <tr><td class="label-cell">韩文CV</td><td class="value-cell">Park Si Yoon</td></tr>
                <tr><td class="label-cell">实装版本</td><td class="value-cell">V3.3</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 角色统计 -->
        <div id="stats" class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)`, backgroundPosition: '100px 0' }"></div>
            <div class="component-header-content">
              <span class="component-title-text">角色统计</span>
              <button class="collapse-btn" @click="toggleCollapse('stats')">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.stats">
            <div class="stat-tabs">
              <button v-for="(tab, i) in statTabs" :key="i" class="stat-tab" :class="{ active: activeStatTab === i }" @click="activeStatTab = i">{{ tab }}</button>
            </div>
            <div class="stat-table-wrapper">
              <table class="info-table" v-for="(table, idx) in statTables" :key="idx" v-show="activeStatTab === idx">
                <colgroup><col style="width:22%"/><col style="width:17.5%"/><col style="width:17%"/><col style="width:22%"/><col style="width:21.5%"/></colgroup>
                <tbody>
                  <tr v-for="(row, r) in table" :key="r">
                    <td class="label-cell" v-for="(cell, c) in row" :key="c" v-html="cell"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 战斗风格 -->
        <div id="battle-style" class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
            <div class="component-header-content">
              <span class="component-title-text">战斗风格</span>
              <button class="collapse-btn" :class="{ active: collapseState.battleStyle }" @click="toggleCollapse('battleStyle')">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.battleStyle">
            <table class="info-table battle-table">
              <colgroup><col style="width:15%"/><col style="width:85%"/></colgroup>
              <tbody>
                <tr>
                  <td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/5210f30d97eb4ca89bc04c9ee250c7c320240802.png" width="64" alt="" /></td>
                  <td class="value-cell"><strong>快速协奏</strong><br/>拥有较高的协奏效率</td>
                </tr>
                <tr>
                  <td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/46fe60eb92b14b938f5d1c5d680bcd1120240802.png" width="64" alt="" /></td>
                  <td class="value-cell"><strong>共鸣解放伤害</strong><br/>共鸣解放伤害较高</td>
                </tr>
                <tr>
                  <td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/cebc386f602a449d9f8d9b5dfd82883f20240802.png" width="64" alt="" /></td>
                  <td class="value-cell"><strong>牵引</strong><br/>可以将一定范围内的目标牵引至特定位置</td>
                </tr>
                <tr>
                  <td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/4346b8fb96724ccf81fe4ef3efd4d9cc20241231.png" width="64" alt="" /></td>
                  <td class="value-cell"><strong>聚爆</strong><br/>可以运用聚爆效应</td>
                </tr>
                <tr>
                  <td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/160e04c923dc47c3830e9995c988436a20251224.png" width="64" alt="" /></td>
                  <td class="value-cell"><strong>谐度破坏增幅</strong><br/>可以提升队伍内特定角色的谐度破坏增幅</td>
                </tr>
                <tr>
                  <td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/9c35ab37748247348157ab393672103720251224.png" width="64" alt="" /></td>
                  <td class="value-cell"><strong>集谐响应</strong><br/>根据自身谐度破坏增幅对目标造成最终伤害提升</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 技能说明 -->
        <div id="skill-desc" class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
            <div class="component-header-content">
              <span class="component-title-text">技能说明</span>
              <button class="collapse-btn" @click="toggleCollapse('skillDesc')">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.skillDesc">
            <div class="skill-images">
              <img src="https://prod-alicdn-community.kurobbs.com/forum/e7e57820c5c94bb8b82772c4b09a0ee220260520.jpg" alt="" class="skill-img" />
              <img src="https://prod-alicdn-community.kurobbs.com/forum/bc7fb2409beb438db14739e59584a9e520260520.jpg" alt="" class="skill-img" />
              <img src="https://prod-alicdn-community.kurobbs.com/forum/bbe10d75dc8a4d0291b45a338f49ea7520260520.jpg" alt="" class="skill-img" />
              <img src="https://prod-alicdn-community.kurobbs.com/forum/855415bf5d9c499287860afbbb613a9e20260520.jpg" alt="" class="skill-img" />
            </div>
            <hr class="skill-divider" />
            <div class="skill-energy">
              <p><strong>特殊能量</strong></p>
              <p>· 处于【<span class="text-gold">布景之形</span>】时，攻击可获得【<span class="text-gold">虚质粒子</span>】。</p>
              <p>· 处于【<span class="text-gold">幻灭之形</span>】时，攻击可消耗【<span class="text-gold">虚质粒子</span>】转化为【<span class="text-gold">共形能量</span>】，为【<span class="text-gold">帷幕终景·幻灭之形</span>】充能。</p>
              <p>· 处于<span class="text-gold">熵变强化</span>状态时，随时间获得【<span class="text-gold">黯核</span>】，可用于释放强化共鸣技能。</p>
              <p>· 释放<span class="text-gold">共鸣解放·布景之形</span>，达妮娅会获得<span class="text-gold">熵变强化·幻灭之形</span>，提升攻击。 释放<span class="text-gold">共鸣解放·幻灭之形</span>，达妮娅会获得<span class="text-gold">熵变强化·布景之形</span>，持续回复【<span class="text-gold">虚质粒子</span>】。</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 模块：角色养成 -->
      <div id="skill-intro" class="module glass-panel">
        <h2 class="module-title">角色养成</h2>

        <!-- 技能介绍 -->
        <div class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)`, backgroundPosition: '97px 0' }"></div>
            <div class="component-header-content">
              <span class="component-title-text">技能介绍</span>
              <button class="collapse-btn" @click="toggleCollapse('skillIntro')">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.skillIntro">
            <div class="skill-tabs">
              <button v-for="(tab, i) in skillTabs" :key="i" class="skill-tab" :class="{ active: activeSkillTab === i }" @click="activeSkillTab = i">{{ tab }}</button>
            </div>

            <!-- 常态攻击 -->
            <div class="skill-content" v-show="activeSkillTab === 0">
              <div class="skill-header">
                <img src="https://prod-alicdn-community.kurobbs.com/forum/16b01ea017a048f8a88a9fd3a0dd6e9f20250720.png" width="91" alt="" />
                <h3 class="skill-name">织梦的飨宴</h3>
              </div>
              <div class="skill-details">
                <p><strong class="text-gold">普攻·布景之形</strong><br/>进行最多4段的连续攻击，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">普攻·幻灭之形</strong><br/>进行最多4段的连续攻击，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">重击·布景之形</strong><br/>消耗耐力，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">重击·幻灭之形</strong><br/>消耗耐力，牵引周围的目标，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">空中攻击·布景之形</strong><br/>消耗耐力进行空中下落攻击，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">空中攻击·幻灭之形</strong><br/>消耗耐力，在空中进行最多4段的连续攻击，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">空中重击·幻灭之形</strong><br/>在空中长按<span class="text-gold">普攻</span>，消耗耐力进行空中下落攻击，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">闪避反击·布景之形</strong><br/>成功闪避后一定时间内短按<span class="text-gold">普攻</span>，将会攻击目标，造成<span class="text-red">热熔伤害</span>。<br/>施放该技能后在一定时间内短按<span class="text-gold">普攻</span>，将会施放<span class="text-gold">普攻·布景之形第4段</span>。</p>
                <p><strong class="text-gold">闪避反击·幻灭之形</strong><br/>成功闪避后一定时间内短按<span class="text-gold">普攻</span>，将会攻击目标，造成<span class="text-red">热熔伤害</span>。<br/>可在空中施放。<br/>施放该技能后在一定时间内短按<span class="text-gold">普攻</span>，将会施放<span class="text-gold">普攻·幻灭之形第4段</span>/<span class="text-gold">空中攻击·幻灭之形第4段</span>。</p>
              </div>
              <hr class="skill-divider" />
              <div class="skill-branch">
                <p><strong class="text-gold" style="font-size:16px"><img src="https://prod-alicdn-community.kurobbs.com/forum/692daaf9ac574b14a8fd8b998bc331d820250209.png" width="91" alt="" />分支强化：属性加成</strong></p>
                <table class="info-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td><p><strong class="text-gold">属性加成:暴击伤害提升</strong></p><p>暴击伤害提升2.40%</p></td>
                      <td><p><strong class="text-gold">属性加成:暴击伤害提升</strong></p><p>暴击伤害提升5.60%</p></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <details class="skill-data-details" open>
                <summary class="skill-data-summary"><strong>技能数据</strong></summary>
                <div class="skill-data-table">
                  <table class="info-table data-table">
                    <thead>
                      <tr><th>等级</th><th>Lv 1</th><th>Lv 2</th><th>Lv 3</th><th>Lv 4</th><th>Lv 5</th><th>Lv 6</th><th>Lv 7</th><th>Lv 8</th><th>Lv 9</th><th>Lv 10</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>普攻·布景之形第一段伤害</td><td>16.44%</td><td>17.79%</td><td>19.14%</td><td>21.03%</td><td>22.38%</td><td>23.93%</td><td>26.08%</td><td>28.24%</td><td>30.40%</td><td>32.69%</td></tr>
                      <tr><td>普攻·布景之形第二段伤害</td><td>15.18%*2</td><td>16.43%*2</td><td>17.67%*2</td><td>19.42%*2</td><td>20.66%*2</td><td>22.09%*2</td><td>24.09%*2</td><td>26.08%*2</td><td>28.07%*2</td><td>30.18%*2</td></tr>
                      <tr><td>普攻·布景之形第三段伤害</td><td>12.82%*3</td><td>13.88%*3</td><td>14.93%*3</td><td>16.40%*3</td><td>17.45%*3</td><td>18.66%*3</td><td>20.34%*3</td><td>22.02%*3</td><td>23.71%*3</td><td>25.49%*3</td></tr>
                      <tr><td>普攻·布景之形第四段伤害</td><td>64.38%</td><td>69.66%</td><td>74.94%</td><td>82.33%</td><td>87.61%</td><td>93.68%</td><td>102.13%</td><td>110.58%</td><td>119.02%</td><td>128.00%</td></tr>
                      <tr><td>重击·布景之形伤害</td><td>40.62%*2</td><td>43.96%*2</td><td>47.29%*2</td><td>51.95%*2</td><td>55.28%*2</td><td>59.11%*2</td><td>64.44%*2</td><td>69.77%*2</td><td>75.10%*2</td><td>80.76%*2</td></tr>
                      <tr><td>空中攻击·布景之形伤害</td><td>14.88%+22.32%</td><td>16.11%+24.16%</td><td>17.33%+25.99%</td><td>19.03%+28.55%</td><td>20.25%+30.38%</td><td>21.66%+32.48%</td><td>23.61%+35.41%</td><td>25.56%+38.34%</td><td>27.51%+41.27%</td><td>29.59%+44.38%</td></tr>
                      <tr><td>闪避反击·布景之形伤害</td><td>24.82%*3</td><td>26.86%*3</td><td>28.90%*3</td><td>31.74%*3</td><td>33.78%*3</td><td>36.12%*3</td><td>39.38%*3</td><td>42.63%*3</td><td>45.89%*3</td><td>49.35%*3</td></tr>
                      <tr><td>普攻·幻灭之形第一段伤害</td><td>18.36%</td><td>19.87%</td><td>21.38%</td><td>23.48%</td><td>24.99%</td><td>26.72%</td><td>29.13%</td><td>31.54%</td><td>33.95%</td><td>36.51%</td></tr>
                      <tr><td>普攻·幻灭之形第二段伤害</td><td>18.87%+7.08%*4</td><td>20.42%+7.66%*4</td><td>21.96%+8.24%*4</td><td>24.13%+9.05%*4</td><td>25.68%+9.63%*4</td><td>27.45%+10.30%*4</td><td>29.93%+11.23%*4</td><td>32.40%+12.15%*4</td><td>34.88%+13.08%*4</td><td>37.51%+14.07%*4</td></tr>
                      <tr><td>普攻·幻灭之形第三段伤害</td><td>31.38%</td><td>33.96%</td><td>36.53%</td><td>40.13%</td><td>42.71%</td><td>45.67%</td><td>49.78%</td><td>53.90%</td><td>58.02%</td><td>62.39%</td></tr>
                      <tr><td>普攻·幻灭之形第四段伤害</td><td>17.88%+41.71%</td><td>19.34%+45.13%</td><td>20.81%+48.55%</td><td>22.86%+53.34%</td><td>24.33%+56.76%</td><td>26.01%+60.69%</td><td>28.36%+66.16%</td><td>30.70%+71.64%</td><td>33.05%+77.11%</td><td>35.54%+82.92%</td></tr>
                      <tr><td>重击·幻灭之形伤害</td><td>68.94%</td><td>74.60%</td><td>80.25%</td><td>88.17%</td><td>93.82%</td><td>100.32%</td><td>109.36%</td><td>118.41%</td><td>127.45%</td><td>137.06%</td></tr>
                      <tr><td>空中攻击·幻灭之形第一段伤害</td><td>18.36%</td><td>19.87%</td><td>21.38%</td><td>23.48%</td><td>24.99%</td><td>26.72%</td><td>29.13%</td><td>31.54%</td><td>33.95%</td><td>36.51%</td></tr>
                      <tr><td>空中攻击·幻灭之形第二段伤害</td><td>18.87%+7.08%*4</td><td>20.42%+7.66%*4</td><td>21.96%+8.24%*4</td><td>24.13%+9.05%*4</td><td>25.68%+9.63%*4</td><td>27.45%+10.30%*4</td><td>29.93%+11.23%*4</td><td>32.40%+12.15%*4</td><td>34.88%+13.08%*4</td><td>37.51%+14.07%*4</td></tr>
                      <tr><td>空中攻击·幻灭之形第三段伤害</td><td>31.38%</td><td>33.96%</td><td>36.53%</td><td>40.13%</td><td>42.71%</td><td>45.67%</td><td>49.78%</td><td>53.90%</td><td>58.02%</td><td>62.39%</td></tr>
                      <tr><td>空中攻击·幻灭之形第四段伤害</td><td>17.88%+41.71%</td><td>19.34%+45.13%</td><td>20.81%+48.55%</td><td>22.86%+53.34%</td><td>24.33%+56.76%</td><td>26.01%+60.69%</td><td>28.36%+66.16%</td><td>30.70%+71.64%</td><td>33.05%+77.11%</td><td>35.54%+82.92%</td></tr>
                      <tr><td>空中重击·幻灭之形伤害</td><td>14.88%+22.32%</td><td>16.11%+24.16%</td><td>17.33%+25.99%</td><td>19.03%+28.55%</td><td>20.25%+30.38%</td><td>21.66%+32.48%</td><td>23.61%+35.41%</td><td>25.56%+38.34%</td><td>27.51%+41.27%</td><td>29.59%+44.38%</td></tr>
                      <tr><td>闪避反击·幻灭之形伤害</td><td>54.36%</td><td>58.82%</td><td>63.28%</td><td>69.52%</td><td>73.98%</td><td>79.10%</td><td>86.24%</td><td>93.37%</td><td>100.50%</td><td>108.08%</td></tr>
                      <tr><td>重击·布景之形耐力消耗</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td></tr>
                      <tr><td>空中攻击·布景之形耐力消耗</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td></tr>
                      <tr><td>重击·幻灭之形耐力消耗</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td></tr>
                      <tr><td>空中攻击·幻灭之形耐力消耗（每段）</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td></tr>
                      <tr><td>空中重击·幻灭之形耐力消耗</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td></tr>
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            <!-- 共鸣技能 -->
            <div class="skill-content" v-show="activeSkillTab === 1">
              <div class="skill-header">
                <img src="https://prod-alicdn-community.kurobbs.com/forum/8221cb4c41234f0baf70ad1ff16de7f820260520.png" width="92" height="92" alt="" />
                <h3 class="skill-name">泡沫蜜饵</h3>
              </div>
              <div class="skill-details">
                <p><strong class="text-gold">拟态泡泡·布景之形</strong><br/>牵引周围的目标，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">轻唤·幻灭之形</strong><br/>牵引周围的目标，造成<span class="text-red">热熔伤害</span>。<br/>该技能与<span class="text-gold">放逐·幻灭之形</span>共享冷却时间。<br/>可在空中施放。</p>
                <p><strong class="text-gold">放逐·幻灭之形</strong><br/>拥有<strong>【<span class="text-gold-underline">黯核</span>】</strong>时，<span class="text-gold">轻唤·幻灭之形</span>替换为<span class="text-gold">放逐·幻灭之形</span>。<br/>施放<strong><span class="text-gold">放逐·幻灭之形</span>第1段</strong>，牵引周围目标，造成<span class="text-red">热熔伤害</span>，施放后一定时间内短按<span class="text-gold">普攻</span>或<span class="text-gold">共鸣技能</span>，可施放<span class="text-gold">放逐·幻灭之形第2段</span>。<br/><span class="text-gold">放逐·幻灭之形第2段</span>将消耗所有<strong>【<span class="text-gold-underline">黯核</span>】</strong>，造成<span class="text-red">热熔伤害</span>，本次攻击每消耗1枚<strong>【<span class="text-gold-underline">黯核</span>】</strong>，伤害倍率提升150%。<br/>该技能伤害为共鸣解放伤害。<br/>该技能与<span class="text-gold">轻唤·幻灭之形</span>共享冷却时间。<br/>可在空中施放。</p>
              </div>
              <hr class="skill-divider" />
              <div class="skill-branch">
                <p><strong class="text-gold" style="font-size:16px"><img src="https://prod-alicdn-community.kurobbs.com/forum/b882ba18c1dd43d5843755e9ae5cda0f20250209.png" width="92" height="92" alt="" />分支强化：属性加成</strong></p>
                <table class="info-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td><p><strong class="text-gold">属性加成: 攻击提升</strong></p><p>攻击提升1.80%</p></td>
                      <td><p><strong class="text-gold">属性加成: 攻击提升</strong></p><p>攻击提升4.20%</p></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <details class="skill-data-details" open>
                <summary class="skill-data-summary"><strong>技能数据</strong></summary>
                <div class="skill-data-table">
                  <table class="info-table data-table">
                    <thead>
                      <tr><th>等级</th><th>Lv 1</th><th>Lv 2</th><th>Lv 3</th><th>Lv 4</th><th>Lv 5</th><th>Lv 6</th><th>Lv 7</th><th>Lv 8</th><th>Lv 9</th><th>Lv 10</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>拟态泡泡·布景之形伤害</td><td>8.76%*3+26.28%</td><td>9.48%*3+28.44%</td><td>10.20%*3+30.59%</td><td>11.21%*3+33.61%</td><td>11.93%*3+35.77%</td><td>12.75%*3+38.25%</td><td>13.90%*3+41.69%</td><td>15.05%*3+45.14%</td><td>16.20%*3+48.59%</td><td>17.42%*3+52.25%</td></tr>
                      <tr><td>轻唤·幻灭之形伤害</td><td>15.65%+7.30%*5</td><td>16.93%+7.90%*5</td><td>18.21%+8.50%*5</td><td>20.01%+9.34%*5</td><td>21.29%+9.94%*5</td><td>22.77%+10.63%*5</td><td>24.82%+11.58%*5</td><td>26.87%+12.54%*5</td><td>28.92%+13.50%*5</td><td>31.10%+14.52%*5</td></tr>
                      <tr><td>放逐·幻灭之形第一段伤害</td><td>17.44%*3</td><td>18.88%*3</td><td>20.31%*3</td><td>22.31%*3</td><td>23.74%*3</td><td>25.38%*3</td><td>27.67%*3</td><td>29.96%*3</td><td>32.25%*3</td><td>34.68%*3</td></tr>
                      <tr><td>放逐·幻灭之形第二段伤害</td><td>56.34%</td><td>60.96%</td><td>65.58%</td><td>72.05%</td><td>76.67%</td><td>81.99%</td><td>89.38%</td><td>96.77%</td><td>104.16%</td><td>112.01%</td></tr>
                      <tr><td>拟态泡泡·布景之形冷却时间</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td></tr>
                      <tr><td>轻唤·幻灭之形冷却时间</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td></tr>
                      <tr><td>放逐·幻灭之形冷却时间</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td></tr>
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            <!-- 共鸣回路 -->
            <div class="skill-content" v-show="activeSkillTab === 2">
              <div class="skill-header">
                <img src="https://prod-alicdn-community.kurobbs.com/forum/a8a0958072284f95b159c2beb551634e20260520.png" width="92" height="92" alt="" />
                <h3 class="skill-name">"天衣无缝"</h3>
              </div>
              <div class="skill-details">
                <p><strong class="text-gold">蚀域</strong><br/>施放共鸣解放<span class="text-gold">帷幕终景·幻灭之形</span>后，生成<span class="text-gold">蚀域</span>，持续30秒。自身生成的<span class="text-gold">蚀域</span>同时最多存在一个。<br/><span class="text-gold">蚀域</span>每4秒发动1次攻击，牵引周围的目标，对目标造成<span class="text-red">热熔伤害</span>。该技能伤害为<span class="text-gold">共鸣解放伤害</span>。</p>
                <p><strong class="text-gold">【虚质粒子】</strong><br/>处于<span class="text-gold">幻灭之形</span>且<strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>大于0时，<span class="text-gold">常态攻击</span>命中目标，消耗<strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>，使本次技能获得以下效果：<br/>·伤害为<span class="text-gold">共鸣解放伤害</span>，且伤害倍率提升50%。<br/>·<strong>【<span class="text-gold-underline">共形能量</span>】</strong>获取效率提升100%。</p>
                <p><strong class="text-gold">共鸣模态·聚爆</strong><br/>处于<span class="text-gold">共鸣模态·聚爆</span>时，获得以下效果：<br/>·以下技能造成伤害时，可为目标附加2次<strong>【<span class="text-gold-underline">聚爆效应</span>】</strong>，同一技能对同一目标2秒内只能触发1次。<br/>变奏技能<span class="text-gold">久疏问候！</span>、变奏技能<span class="text-gold">轻叩门扉</span>、共鸣解放<span class="text-gold">帷幕终景·布景之形</span>、共鸣解放<span class="text-gold">帷幕终景·幻灭之形</span>、<span class="text-gold">蚀域</span>。<br/>·以下技能造成伤害时，可为目标附加<strong>【<span class="text-gold-underline">聚爆效应</span>】</strong>，同一技能对同一目标2秒内只能触发1次。<br/><span class="text-gold">普攻·布景之形第3段</span>、<span class="text-gold">普攻·布景之形第4段</span>、<span class="text-gold">普攻·幻灭之形第3段</span>、<span class="text-gold">普攻·幻灭之形第4段</span>、<span class="text-gold">空中攻击·幻灭之形第3段</span>、<span class="text-gold">空中攻击·幻灭之形第4段</span>。<br/>·达妮娅处于编队时，敌人被<strong>【<span class="text-gold-underline">聚爆效应</span>】</strong>的伤害击败，本次击败将视为距离其最近的登场角色造成。</p>
                <p><strong class="text-gold">共鸣模态·集谐</strong><br/>处于<span class="text-gold">共鸣模态·集谐</span>时，获得以下效果：<br/>·以下技能造成伤害时，可为目标附加<strong>【<span class="text-gold-underline">集谐·偏移</span>】</strong>，刷新目标<strong>【<span class="text-gold-underline">集谐·干涉</span>】</strong>的持续时间，同一技能对同一目标2秒内只能触发1次。<br/>变奏技能<span class="text-gold">久疏问候！</span>、变奏技能<span class="text-gold">轻叩门扉</span>、共鸣解放<span class="text-gold">帷幕终景·布景之形</span>、共鸣解放<span class="text-gold">帷幕终景·幻灭之形</span>、<span class="text-gold">蚀域</span>、<span class="text-gold">普攻·布景之形第3段</span>、<span class="text-gold">普攻·布景之形第4段</span>、<span class="text-gold">普攻·幻灭之形第3段</span>、<span class="text-gold">普攻·幻灭之形第4段</span>、<span class="text-gold">空中攻击·幻灭之形第3段</span>、<span class="text-gold">空中攻击·幻灭之形第4段</span>。<br/>·队伍中的角色附加<strong>【<span class="text-gold-underline">集谐·偏移</span>】</strong>时，目标将积累偏谐值上限50%的<strong>【<span class="text-gold-underline">偏谐值</span>】</strong>，该效果对同一目标300秒内只能触发1次。</p>
                <p><strong class="text-gold">【黯核】获取规则</strong><br/><strong>【<span class="text-gold-underline">黯核</span>】</strong>上限3枚。<br/>处于<span class="text-gold">熵变强化</span>时，每12秒获得1枚<strong>【<span class="text-gold-underline">黯核</span>】</strong>。<br/>施放变奏技能<span class="text-gold">久疏问候！</span>、变奏技能<span class="text-gold">轻叩门扉</span>获得1枚<strong>【<span class="text-gold-underline">黯核</span>】</strong>。</p>
                <p><strong class="text-gold">【虚质粒子】获取规则</strong><br/><strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>上限100点。<br/>处于<span class="text-gold">布景之形</span>，<span class="text-gold">常态攻击</span>造成伤害时，获得<strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>。<br/>施放变奏技能<span class="text-gold">久疏问候！</span>、变奏技能<span class="text-gold">轻叩门扉</span>、共鸣技能<span class="text-gold">拟态泡泡·布景之形</span>获得25点<strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>。</p>
                <p><strong class="text-gold">【共形能量】获取规则</strong><br/><strong>【<span class="text-gold-underline">共形能量</span>】</strong>上限100点。<br/>处于<span class="text-gold">幻灭之形</span>，<strong>常态攻击</strong>、共鸣技能<span class="text-gold">轻唤·幻灭之形</span>造成伤害时，获得<strong>【<span class="text-gold-underline">共形能量</span>】</strong>。<br/>施放共鸣技能<span class="text-gold">放逐·幻灭之形第2段</span>获得40点<strong>【<span class="text-gold-underline">共形能量</span>】</strong>。</p>
              </div>
              <hr class="skill-divider" />
              <div class="skill-branch">
                <p><strong class="text-gold" style="font-size:16px">分支强化：固定技能</strong></p>
                <table class="info-table circuit-table">
                  <colgroup><col style="width:17%"/><col style="width:83%"/></colgroup>
                  <tbody>
                    <tr>
                      <td class="circuit-icon-cell">
                        <img src="https://prod-alicdn-community.kurobbs.com/forum/5c4bc2c4b1ad42d19c9ffdd22fea138220260520.png" width="92" height="92" alt="" /><br/>
                        <strong class="text-gold">伪物弥留</strong>
                      </td>
                      <td class="value-cell">处于<span class="text-gold">布景之形</span>进入战斗时，<strong>【<span class="text-gold-underline">黯核</span>】</strong>不足2枚则回复至2枚，<strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>不足20点则回复至20点。该效果每12秒可触发1次。</td>
                    </tr>
                    <tr>
                      <td class="circuit-icon-cell">
                        <img src="https://prod-alicdn-community.kurobbs.com/forum/945ccf37f3a540a0a63d237283dcc45c20260520.png" width="92" height="92" alt="" /><br/>
                        <strong class="text-gold">蚀刻繁彩</strong>
                      </td>
                      <td class="value-cell">处于<span class="text-gold">熵变强化</span>时，根据<span class="text-gold">共鸣模态</span>获得以下效果：<br/>·若处于<span class="text-gold">共鸣模态·聚爆</span>，队伍中的角色<span class="text-red">热熔伤害加成提升</span>30%。<br/>·若处于<span class="text-gold">共鸣模态·集谐</span>，队伍中的角色<strong>谐度破坏增幅提升</strong>10点。队伍中的角色偏谐值累积效率超过100%时，每超过10%的偏谐值累积效率使对应角色谐度破坏增幅提升8点，上限40点。</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <details class="skill-data-details" open>
                <summary class="skill-data-summary"><strong>技能数据</strong></summary>
                <div class="skill-data-table">
                  <table class="info-table data-table">
                    <thead>
                      <tr><th>等级</th><th>Lv 1</th><th>Lv 2</th><th>Lv 3</th><th>Lv 4</th><th>Lv 5</th><th>Lv 6</th><th>Lv 7</th><th>Lv 8</th><th>Lv 9</th><th>Lv 10</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>蚀域每次伤害</td><td>68.58%</td><td>74.20%</td><td>79.82%</td><td>87.69%</td><td>93.32%</td><td>99.78%</td><td>108.78%</td><td>117.78%</td><td>126.77%</td><td>136.33%</td></tr>
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            <!-- 共鸣解放 -->
            <div class="skill-content" v-show="activeSkillTab === 3">
              <div class="skill-header">
                <img src="https://prod-alicdn-community.kurobbs.com/forum/e0ae116cd20a4872b3d0ee33209f8bc020260520.png" width="92" height="92" alt="" />
                <h3 class="skill-name">帷幕终景</h3>
              </div>
              <div class="skill-details">
                <p><strong class="text-gold">帷幕终景·布景之形</strong><br/>造成<span class="text-red">热熔伤害</span>。<br/>施放该技能时，获得<span class="text-gold">熵变强化·幻灭之形</span>，持续12秒。随后切换至<span class="text-gold">幻灭之形</span>。</p>
                <p><strong class="text-gold">帷幕终景·幻灭之形</strong><br/><strong>【<span class="text-gold-underline">共形能量</span>】</strong>满时，可消耗所有<strong>【<span class="text-gold-underline">共形能量</span>】</strong>与<strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>施放该技能。<br/>造成<span class="text-red">热熔伤害</span>。<br/>施放该技能后，获得<span class="text-gold">熵变强化·布景之形</span>，持续30秒。随后切换至<span class="text-gold">布景之形</span>。<br/>可在空中施放。</p>
                <p><strong class="text-gold">熵变强化·幻灭之形</strong><br/><strong>攻击提升</strong>30%。<br/>获得该效果时，移除<span class="text-gold">熵变强化·布景之形</span>。</p>
                <p><strong class="text-gold">熵变强化·布景之形</strong><br/>每秒获得1点<strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>。<br/>获得该效果时，移除<span class="text-gold">熵变强化·幻灭之形</span>。</p>
              </div>
              <hr class="skill-divider" />
              <div class="skill-branch">
                <p><strong class="text-gold" style="font-size:16px"><img src="https://prod-alicdn-community.kurobbs.com/forum/b882ba18c1dd43d5843755e9ae5cda0f20250209.png" width="92" height="92" alt="" />分支强化：属性加成</strong></p>
                <table class="info-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td><p><strong class="text-gold">属性加成: 攻击提升</strong></p><p>攻击提升1.80%</p></td>
                      <td><p><strong class="text-gold">属性加成: 攻击提升</strong></p><p>攻击提升4.20%</p></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <details class="skill-data-details" open>
                <summary class="skill-data-summary"><strong>技能数据</strong></summary>
                <div class="skill-data-table">
                  <table class="info-table data-table">
                    <thead>
                      <tr><th>等级</th><th>Lv 1</th><th>Lv 2</th><th>Lv 3</th><th>Lv 4</th><th>Lv 5</th><th>Lv 6</th><th>Lv 7</th><th>Lv 8</th><th>Lv 9</th><th>Lv 10</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>帷幕终景·布景之形伤害</td><td>200.00%</td><td>216.40%</td><td>232.80%</td><td>255.76%</td><td>272.16%</td><td>291.02%</td><td>317.26%</td><td>343.50%</td><td>369.74%</td><td>397.62%</td></tr>
                      <tr><td>帷幕终景·幻灭之形伤害</td><td>100.00%*4</td><td>108.20%*4</td><td>116.40%*4</td><td>127.88%*4</td><td>136.08%*4</td><td>145.51%*4</td><td>158.63%*4</td><td>171.75%*4</td><td>184.87%*4</td><td>198.81%*4</td></tr>
                      <tr><td>帷幕终景·布景之形冷却时间</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td></tr>
                      <tr><td>帷幕终景·幻灭之形冷却时间</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td></tr>
                      <tr><td>帷幕终景·布景之形消耗共鸣能量</td><td>125</td><td>125</td><td>125</td><td>125</td><td>125</td><td>125</td><td>125</td><td>125</td><td>125</td><td>125</td></tr>
                      <tr><td>帷幕终景·布景之形回复协奏能量</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td></tr>
                      <tr><td>帷幕终景·幻灭之形回复协奏能量</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td></tr>
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            <!-- 变奏技能 -->
            <div class="skill-content" v-show="activeSkillTab === 4">
              <div class="skill-header">
                <img src="https://prod-alicdn-community.kurobbs.com/forum/66bfa442b5144fa1b0f92687211506cb20260520.png" width="92" height="92" alt="" />
                <h3 class="skill-name">谨此致访</h3>
              </div>
              <div class="skill-details">
                <p><strong class="text-gold">久疏问候！</strong><br/>处于<span class="text-gold">布景之形</span>时可施放该技能，造成<span class="text-red">热熔伤害</span>。<br/>施放该技能后在一定时间内短按<span class="text-gold">普攻</span>，将会施放<span class="text-gold">普攻·布景之形第4段</span>。</p>
                <p><strong class="text-gold">轻叩门扉</strong><br/>处于<span class="text-gold">幻灭之形</span>时可施放该技能，造成<span class="text-red">热熔伤害</span>。<br/>施放该技能时，获得<span class="text-gold">熵变强化·幻灭之形</span>，持续12秒。</p>
              </div>
              <hr class="skill-divider" />
              <div class="skill-branch">
                <p><strong class="text-gold" style="font-size:16px"><img src="https://prod-alicdn-community.kurobbs.com/forum/692daaf9ac574b14a8fd8b998bc331d820250209.png" width="91" alt="" />分支强化：属性加成</strong></p>
                <table class="info-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td><p><strong class="text-gold">属性加成:暴击伤害提升</strong></p><p>暴击伤害提升2.40%</p></td>
                      <td><p><strong class="text-gold">属性加成:暴击伤害提升</strong></p><p>暴击伤害提升5.60%</p></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <details class="skill-data-details" open>
                <summary class="skill-data-summary"><strong>技能数据</strong></summary>
                <div class="skill-data-table">
                  <table class="info-table data-table">
                    <thead>
                      <tr><th>等级</th><th>Lv 1</th><th>Lv 2</th><th>Lv 3</th><th>Lv 4</th><th>Lv 5</th><th>Lv 6</th><th>Lv 7</th><th>Lv 8</th><th>Lv 9</th><th>Lv 10</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>久疏问候！伤害</td><td>52.62%</td><td>56.94%</td><td>61.25%</td><td>67.30%</td><td>71.61%</td><td>76.57%</td><td>83.48%</td><td>90.38%</td><td>97.28%</td><td>104.62%</td></tr>
                      <tr><td>轻叩门扉伤害</td><td>26.02%*3</td><td>28.16%*3</td><td>30.29%*3</td><td>33.28%*3</td><td>35.41%*3</td><td>37.87%*3</td><td>41.28%*3</td><td>44.69%*3</td><td>48.11%*3</td><td>51.74%*3</td></tr>
                      <tr><td>久疏问候！回复协奏能量</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td></tr>
                      <tr><td>轻叩门扉回复协奏能量</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td></tr>
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            <!-- 延奏技能 -->
            <div class="skill-content" v-show="activeSkillTab === 5">
              <div class="skill-header">
                <img src="https://prod-alicdn-community.kurobbs.com/forum/0d1d9fe449f8431e95f7ebf096a2379d20260520.png" width="92" height="92" alt="" />
                <h3 class="skill-name">未竟的谎言</h3>
              </div>
              <div class="skill-details">
                <p>处于<span class="text-gold">共鸣模态·聚爆</span>时，队伍中登场角色周围的<strong>目标受到聚爆效应伤害加深</strong>60%，持续30秒。<br/>达妮娅切换模态时，该效果提前结束。</p>
                <p>处于<span class="text-gold">共鸣模态·集谐</span>时，下一个登场的<strong>角色全伤害加深</strong>15%，持续16秒。<br/>效果持续期间，该角色附加<strong>【<span class="text-gold-underline">集谐·偏移</span>】</strong>后，该<strong>全伤害加深效果提升</strong>至40%。<br/>切换至其他角色或达妮娅切换模态时，该效果提前结束。</p>
              </div>
            </div>

            <!-- 谐度破坏 -->
            <div class="skill-content" v-show="activeSkillTab === 6">
              <div class="skill-header">
                <img src="https://prod-alicdn-community.kurobbs.com/forum/d4de0316f1e74bd5b785c134d34c592620251224.png" width="92" height="92" alt="" />
                <h3 class="skill-name">计时的溃灭</h3>
              </div>
              <div class="skill-details">
                <p>目标<strong>【<span class="text-gold-underline">偏谐值</span>】</strong>满时，达妮娅可对其施放<strong>【<span class="text-gold-underline">谐度破坏</span>】</strong>。</p>
                <p>处于<span class="text-gold">共鸣模态·集谐</span>时，获得以下效果：<br/>·达妮娅拥有为目标附加<strong>【<span class="text-gold-underline">集谐·偏移</span>】</strong>的能力。<br/>·达妮娅拥有响应<strong>【<span class="text-gold-underline">集谐·干涉</span>】</strong>的能力。<br/>响应<strong>【<span class="text-gold-underline">集谐·干涉</span>】</strong>：目标每有一层<strong>【<span class="text-gold-underline">集谐·干涉</span>】</strong>效果，达妮娅自身的每点谐度破坏增幅会使自身对该目标造成的最终伤害提升0.12%。达妮娅在编队中时，目标的<strong>【<span class="text-gold-underline">集谐·干涉</span>】</strong>效果的层数上限增加1层。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 共鸣链 -->
        <div class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
            <div class="component-header-content">
              <span class="component-title-text">共鸣链</span>
              <button class="collapse-btn" @click="toggleCollapse('resonanceChain')">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.resonanceChain">
            <table class="info-table resonance-table">
              <colgroup><col style="width:25%"/><col style="width:75%"/></colgroup>
              <tbody>
                <tr>
                  <td class="label-cell">名称</td>
                  <td class="label-cell">效果</td>
                </tr>
                <tr>
                  <td class="resonance-name-cell">
                    <img src="https://prod-alicdn-community.kurobbs.com/forum/27a4bed1b8f443c99a77e5cfef8cbb8320260520.png" width="42" height="42" alt="" /><br/>
                    <strong>薄明梦中的寂静光辉</strong>
                  </td>
                  <td class="value-cell">
                    暴击伤害提升<strong>30</strong>%。<br/>
                    施放共鸣技能<span class="text-gold">拟态泡泡·布景之形</span>、<span class="text-gold">共鸣技能放逐·幻灭之形</span>、<span class="text-gold">普攻·幻灭之形第3段</span>、<span class="text-gold">普攻·幻灭之形第4段</span>、<span class="text-gold">空中攻击·幻灭之形第3段</span>、<span class="text-gold">空中攻击·幻灭之形第4段</span>期间，免疫打断。<br/>
                    处于<span class="text-gold">布景之形</span>进入战斗时，获得<span class="text-gold">熵变强化·布景之形</span>，持续<strong>30</strong>秒。<br/>
                    处于<span class="text-gold">幻灭之形</span>进入战斗时，获得<span class="text-gold">熵变强化·幻灭之形</span>，持续<strong>12</strong>秒。
                  </td>
                </tr>
                <tr>
                  <td class="resonance-name-cell">
                    <img src="https://prod-alicdn-community.kurobbs.com/forum/9f0cfb10f6464f38a72c63c4c0f2e8e020260520.png" width="42" height="42" alt="" /><br/>
                    <strong>坠入此世一片潮水</strong>
                  </td>
                  <td class="value-cell">
                    处于<span class="text-gold">共鸣模态·聚爆</span>，队伍中的角色施加<span class="text-red">【聚爆效应】</span>后，该角色热熔伤害加成提升<strong>50</strong>%，持续<strong>15</strong>秒。登场角色附近的敌人触发<span class="text-red">【聚爆效应】</span>引爆后，达妮娅获得<strong>1</strong>层<span class="text-gold">简并虚质</span>，持续<strong>15</strong>秒，上限<strong>10</strong>层。每层<span class="text-gold">简并虚质</span>使达妮娅造成伤害无视目标<strong>1</strong>%热熔伤害抗性。<br/>
                    达妮娅切换模态时，该效果提前结束。<br/>
                    处于<span class="text-gold">共鸣模态·集谐</span>，<span class="text-gold">共鸣回路</span>效果提升：队伍中的角色施加<span class="text-gold">【集谐·偏移】</span>后，该角色谐度破坏增幅提升<strong>20</strong>点，持续<strong>15</strong>秒，目标将积累偏谐值上限<strong>100</strong>%的<span class="text-gold">【偏谐值】</span>，积累<span class="text-gold">【偏谐值】</span>效果对同一目标<strong>300</strong>秒内只能触发<strong>1</strong>次。<br/>
                    达妮娅切换模态时，该效果提前结束。<br/>
                    共鸣技能<span class="text-gold">放逐·幻灭之形</span>伤害倍率提升<strong>40</strong>%。
                  </td>
                </tr>
                <tr>
                  <td class="resonance-name-cell">
                    <img src="https://prod-alicdn-community.kurobbs.com/forum/2a7c62a450f94f5aaa8ec7ef24a3481c20260520.png" width="42" height="42" alt="" /><br/>
                    <strong>黑夜与风中奔驰着赤杨</strong>
                  </td>
                  <td class="value-cell">
                    共鸣解放<span class="text-gold">帷幕终景·幻灭之形</span>伤害倍率提升<strong>80</strong>%。<br/>
                    <span class="text-gold">【黯核】</span>上限提升至5枚，处于<span class="text-gold">熵变强化</span>时，<span class="text-gold">【黯核】</span>的获取间隔缩短至<strong>6</strong>秒。<br/>
                    <span class="text-gold">熵变强化·布景之形</span>效果获得强化：每秒获得<span class="text-gold">【虚质粒子】</span>提升至<strong>4</strong>点。<br/>
                    <span class="text-gold">熵变强化·幻灭之形</span>效果获得强化：施放共鸣解放<span class="text-gold">帷幕终景·幻灭之形</span>时，额外回复<strong>30</strong>点协奏能量。<br/>
                    固有技能<span class="text-gold">伪物弥留</span>效果强化：进入战斗时，<span class="text-gold">【黯核】</span>与<span class="text-gold">【虚质粒子】</span>回复至上限。该效果每<strong>12</strong>秒可触发<strong>1</strong>次。<br/>
                    <span class="text-gold">【黯核】</span>数量达到上限时，施放<strong>普攻·布景之形第4段</strong>、共鸣技能<span class="text-gold">拟态泡泡·布景之形</span>消耗所有<span class="text-gold">【黯核】</span>，使本次技能伤害倍率增加<strong>1200</strong>%，本次伤害为<span class="text-gold">共鸣解放伤害</span>。
                  </td>
                </tr>
                <tr>
                  <td class="resonance-name-cell">
                    <img src="https://prod-alicdn-community.kurobbs.com/forum/0995ef1878aa42209db44eb6bd9f00c420260520.png" width="42" height="42" alt="" /><br/>
                    <strong>从远方，回到远方</strong>
                  </td>
                  <td class="value-cell"><span class="text-gold">蚀域</span>攻击间隔缩短至<strong>3</strong>秒。</td>
                </tr>
                <tr>
                  <td class="resonance-name-cell">
                    <img src="https://prod-alicdn-community.kurobbs.com/forum/e12ad39723cc414c8d8eb8c09584461d20260520.png" width="42" height="42" alt="" /><br/>
                    <strong>若能以谎言缝补心脏</strong>
                  </td>
                  <td class="value-cell">共鸣解放<span class="text-gold">帷幕终景·布景之形</span>造成的伤害提升<strong>100</strong>%。</td>
                </tr>
                <tr>
                  <td class="resonance-name-cell">
                    <img src="https://prod-alicdn-community.kurobbs.com/forum/f34fb6872c6147f48dfc7f2542b8655420260520.png" width="42" height="42" alt="" /><br/>
                    <strong>祝愿你于静默中，得到太阳</strong>
                  </td>
                  <td class="value-cell">
                    处于<span class="text-gold">熵变强化</span>时，攻击提升<strong>60</strong>%，热熔伤害加成提升<strong>60</strong>%。<br/>
                    处于<span class="text-gold">共鸣模态·聚爆</span>时，<span class="text-gold">蚀域</span>对目标造成伤害后，根据<span class="text-red">【聚爆效应】</span>层数上限引爆<span class="text-red">【聚爆效应】</span>，本次引爆对<span class="text-red">【聚爆效应】</span>主目标的伤害倍率提升<strong>200</strong>%，且不移除<strong><span class="text-red">【聚爆效应】</span></strong>层数。同一目标最多可受到<strong>1</strong>次该效果，目标受到共鸣解放<span class="text-gold">帷幕终景·幻灭之形</span>的伤害后，重置该次数，重置效果对同一目标<strong>2</strong>秒内只能触发<strong>1</strong>次。<br/>
                    处于<span class="text-gold">共鸣模态·集谐</span>时，队伍中的角色对拥有<span class="text-gold">【集谐·偏移】</span>的<span class="text-gold">【失谐】</span>目标造成<span class="text-gold">谐度破坏伤害</span>时，将额外附加<strong>1</strong>层<span class="text-gold"><strong>【集谐·干涉】</strong></span>，该效果对同一目标3秒内只能触发<strong>1</strong>次。
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 角色突破材料 -->
        <div class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
            <div class="component-header-content">
              <span class="component-title-text">角色突破材料</span>
              <button class="collapse-btn" @click="toggleCollapse('breakthrough')">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.breakthrough">
            <div class="stat-tabs">
              <button v-for="(tab, i) in breakthroughTabs" :key="i" class="stat-tab" :class="{ active: activeBreakthroughTab === i }" @click="activeBreakthroughTab = i">{{ tab }}</button>
            </div>

            <!-- 一阶突破 -->
            <div class="breakthrough-content" v-show="activeBreakthroughTab === 0">
              <table class="info-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr><td class="label-cell">所需等级</td><td class="value-cell">20</td></tr>
                  <tr><td class="label-cell">等级上限</td><td class="value-cell">40</td></tr>
                  <tr><td class="label-cell" colspan="2">突破素材</td></tr>
                </tbody>
              </table>
              <table class="info-table material-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/7e8de832062d4ae49af023383823988420251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446635372963983360" target="_blank">低频锐棱声核</a>x4</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x5000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 二阶突破 -->
            <div class="breakthrough-content" v-show="activeBreakthroughTab === 1">
              <table class="info-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr><td class="label-cell">所需等级</td><td class="value-cell">40</td></tr>
                  <tr><td class="label-cell">等级上限</td><td class="value-cell">50</td></tr>
                  <tr><td class="label-cell" colspan="2">突破素材</td></tr>
                </tbody>
              </table>
              <table class="info-table material-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x4</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/da19f7ccbfa941d19f0aa777feb85b1520260429.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1499167890179710976" target="_blank">星之梦</a>x4</td>
                  </tr>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/369e3015807741cf95d22306c08d957820251222.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1449136139499237376" target="_blank">不熄的裁决</a>x3</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x10000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 三阶突破 -->
            <div class="breakthrough-content" v-show="activeBreakthroughTab === 2">
              <table class="info-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr><td class="label-cell">所需等级</td><td class="value-cell">50</td></tr>
                  <tr><td class="label-cell">等级上限</td><td class="value-cell">60</td></tr>
                  <tr><td class="label-cell" colspan="2">突破素材</td></tr>
                </tbody>
              </table>
              <table class="info-table material-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x8</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/da19f7ccbfa941d19f0aa777feb85b1520260429.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1499167890179710976" target="_blank">星之梦</a>x8</td>
                  </tr>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/369e3015807741cf95d22306c08d957820251222.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1449136139499237376" target="_blank">不熄的裁决</a>x6</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x15000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 四阶突破 -->
            <div class="breakthrough-content" v-show="activeBreakthroughTab === 3">
              <table class="info-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr><td class="label-cell">所需等级</td><td class="value-cell">60</td></tr>
                  <tr><td class="label-cell">等级上限</td><td class="value-cell">70</td></tr>
                  <tr><td class="label-cell" colspan="2">突破素材</td></tr>
                </tbody>
              </table>
              <table class="info-table material-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x4</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/da19f7ccbfa941d19f0aa777feb85b1520260429.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1499167890179710976" target="_blank">星之梦</a>x12</td>
                  </tr>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/369e3015807741cf95d22306c08d957820251222.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1449136139499237376" target="_blank">不熄的裁决</a>x9</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x20000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 五阶突破 -->
            <div class="breakthrough-content" v-show="activeBreakthroughTab === 4">
              <table class="info-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr><td class="label-cell">所需等级</td><td class="value-cell">70</td></tr>
                  <tr><td class="label-cell">等级上限</td><td class="value-cell">80</td></tr>
                  <tr><td class="label-cell" colspan="2">突破素材</td></tr>
                </tbody>
              </table>
              <table class="info-table material-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x8</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/da19f7ccbfa941d19f0aa777feb85b1520260429.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1499167890179710976" target="_blank">星之梦</a>x16</td>
                  </tr>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/369e3015807741cf95d22306c08d957820251222.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1449136139499237376" target="_blank">不熄的裁决</a>x12</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x40000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 六阶突破 -->
            <div class="breakthrough-content" v-show="activeBreakthroughTab === 5">
              <table class="info-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr><td class="label-cell">所需等级</td><td class="value-cell">80</td></tr>
                  <tr><td class="label-cell">等级上限</td><td class="value-cell">90</td></tr>
                  <tr><td class="label-cell" colspan="2">突破素材</td></tr>
                </tbody>
              </table>
              <table class="info-table material-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x4</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/da19f7ccbfa941d19f0aa777feb85b1520260429.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1499167890179710976" target="_blank">星之梦</a>x20</td>
                  </tr>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/369e3015807741cf95d22306c08d957820251222.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1449136139499237376" target="_blank">不熄的裁决</a>x16</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x80000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const currentBanner = ref('/image/archive.jpeg')
const isNavCollapsed = ref(false)
const activeImageTab = ref(0)
const activeStatTab = ref(0)
const activeSkillTab = ref(0)
const activeBreakthroughTab = ref(0)

const roleBg = ref('https://prod-alicdn-community.kurobbs.com/forum/cbe1a0d853d14e5aaac4c84c7d28e74d20260401.png?x-oss-process=image/format,webp')
const attrIcon = ref('https://prod-alicdn-community.kurobbs.com/forum/a8a304ec837d4c22bc13cc7aa3c7f72420260401.png')

const roleImages = ref([
  'https://prod-alicdn-community.kurobbs.com/forum/176a32e3cefe47a4a29819d033a306cc20260521.png?x-oss-process=image/format,webp',
  'https://prod-alicdn-community.kurobbs.com/forum/625294f4d0b740f4bf5ce693ddb0b35920260521.png?x-oss-process=image/format,webp',
  'https://prod-alicdn-community.kurobbs.com/forum/492b30d224bf47429e8aa73a9cfd104a20260521.png?x-oss-process=image/format,webp'
])

const statTabs = ['1', '20', '40', '50', '60', '70', '80', '90']

const statTables = [
  // Lv 1
  [
    ['无突破', '无突破', '', '攻击提升', '0%（12%）'],
    ['基础生命', '882', '', '暴击伤害', '150%（166%）'],
    ['基础攻击', '34', '', '治疗效果加成', '0%'],
    ['基础防御', '94', '', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ],
  // Lv 20
  [
    ['一阶突破', '突破前', '突破后', '攻击提升', '0%（12%）'],
    ['基础生命', '2294', '2882', '暴击伤害', '150%（166%）'],
    ['基础攻击', '88', '113', '治疗效果加成', '0%'],
    ['基础防御', '241', '302', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ],
  // Lv 40
  [
    ['二阶突破', '突破前', '突破后', '攻击提升', '0%（12%）'],
    ['基础生命', '4368', '4956', '暴击伤害', '150%（166%）'],
    ['基础攻击', '171', '196', '治疗效果加成', '0%'],
    ['基础防御', '456', '517', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ],
  // Lv 50
  [
    ['三阶突破', '突破前', '突破后', '攻击提升', '0%（12%）'],
    ['基础生命', '5699', '6287', '暴击伤害', '150%（166%）'],
    ['基础攻击', '225', '250', '治疗效果加成', '0%'],
    ['基础防御', '595', '656', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ],
  // Lv 60
  [
    ['四阶突破', '突破前', '突破后', '攻击提升', '0%（12%）'],
    ['基础生命', '7031', '7619', '暴击伤害', '150%（166%）'],
    ['基础攻击', '279', '305', '治疗效果加成', '0%'],
    ['基础防御', '733', '794', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ],
  // Lv 70
  [
    ['五阶突破', '突破前', '突破后', '攻击提升', '0%（12%）'],
    ['基础生命', '8362', '8950', '暴击伤害', '150%（166%）'],
    ['基础攻击', '333', '350', '治疗效果加成', '0%'],
    ['基础防御', '872', '933', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ],
  // Lv 80
  [
    ['六阶突破', '突破前', '突破后', '攻击提升', '0%（12%）'],
    ['基础生命', '9693', '10281', '暴击伤害', '150%（166%）'],
    ['基础攻击', '379', '396', '治疗效果加成', '0%'],
    ['基础防御', '1010', '1071', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ],
  // Lv 90
  [
    ['满突破', '满突破', '', '攻击提升', '0%（12%）'],
    ['基础生命', '11025', '', '暴击伤害', '150%（166%）'],
    ['基础攻击', '425', '', '治疗效果加成', '0%'],
    ['基础防御', '1148', '', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ]
]

const skillTabs = ['常态攻击', '共鸣技能', '共鸣回路', '共鸣解放', '变奏技能', '延奏技能', '谐度破坏']

const collapseState = reactive({
  otherInfo: false,
  stats: false,
  battleStyle: true,
  skillDesc: false,
  skillIntro: false,
  resonanceChain: false,
  breakthrough: false
})

const toggleCollapse = (key: keyof typeof collapseState) => {
  collapseState[key] = !collapseState[key]
}

const breakthroughTabs = ['一阶突破', '二阶突破', '三阶突破', '四阶突破', '五阶突破', '六阶突破']

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const toggleNav = () => {
  isNavCollapsed.value = !isNavCollapsed.value
}
</script>

<style scoped>
.wiki-view {
  width: 100vw;
  height: 100vh;
  overflow-y: overlay;
  overflow-x: hidden;
  pointer-events: auto;
  scroll-behavior: smooth;
}

.wiki-view::-webkit-scrollbar {
  width: 6px;
}
.wiki-view::-webkit-scrollbar-thumb {
  background: rgba(var(--c-pink), 0.3);
  border-radius: 10px;
}

/* Banner */
.banner-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center 20%;
  background-attachment: fixed;
  box-shadow: inset 0 -150px 100px -50px rgba(10, 5, 10, 0.9);
}

.banner-actions {
  position: absolute;
  top: 66.6%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 2rem;
  z-index: 10;
}

.banner-btn {
  background: rgba(20, 10, 20, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(var(--c-pink), 0.5);
  color: #fff;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.15rem;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(228, 144, 179, 0.4), inset 0 0 10px rgba(var(--c-pink), 0.2);
  transition: all 0.3s ease;
}

.banner-btn:hover {
  background: rgba(var(--c-pink), 0.3);
  border-color: rgba(var(--c-pink), 0.8);
  box-shadow: 0 5px 25px rgba(var(--c-pink), 0.6), inset 0 0 15px rgba(var(--c-pink), 0.4);
  transform: translateY(-3px);
}

/* 主内容区 */
.content-section {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding: 6rem 2rem;
  background: linear-gradient(180deg, rgba(10, 5, 10, 0.9) 0%, rgba(var(--c-purple), 0.4) 100%);
}

/* 模块容器 */
.module {
  width: 100%;
  max-width: 1400px;
  border-radius: 16px;
  background: rgba(20, 10, 20, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(var(--c-pink), 0.2);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 3rem 4vw;
}

.module-title {
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  color: #fff;
  text-align: center;
  margin: 0 0 2rem 0;
  letter-spacing: 0.2rem;
  text-shadow: 0 0 20px rgba(var(--c-pink), 0.6);
}

/* 角色展示组件 */
.role-component {
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
}

.role-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  min-height: 500px;
}

.role-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.role-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.role-images {
  flex: 1;
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.role-images .figure {
  display: none;
}

.role-images .figure.figure-visible {
  display: block;
}

.role-images .figure img {
  max-height: 600px;
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(var(--c-pink), 0.15));
}

.role-profile {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
}

.main-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.attr-icon {
  width: 72px;
  height: 72px;
  filter: drop-shadow(0 0 10px rgba(var(--c-pink), 0.6));
}

.name-block {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0;
  color: #fff;
  letter-spacing: 0.2rem;
  text-shadow: 0 0 15px rgba(var(--c-pink), 0.5);
}

.name-en {
  font-size: 1.2rem;
  color: rgb(var(--c-light-blue));
  letter-spacing: 0.4rem;
  margin-top: 4px;
}

.hr-line {
  width: 340px;
  max-width: 100%;
  margin: 1.5rem 0;
}

.lore-title {
  color: rgb(var(--c-pink));
  font-size: clamp(1rem, 2vw, 1.3rem);
  letter-spacing: 0.1rem;
  margin-bottom: 0.8rem;
}

.lore-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: clamp(0.9rem, 1.5vw, 1.05rem);
  line-height: 1.8;
  letter-spacing: 0.05rem;
  font-weight: 300;
}

.tags-block {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.tag {
  background: rgba(var(--c-deep-blue), 0.3);
  border: 1px solid rgba(var(--c-light-blue), 0.4);
  color: rgb(var(--c-light-blue));
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  font-size: 0.9rem;
  letter-spacing: 0.1rem;
  transition: all 0.3s ease;
}

.tag:hover {
  background: rgba(var(--c-pink), 0.2);
  border-color: rgb(var(--c-pink));
  color: #fff;
}

/* 立绘切换标签 */
.role-tabs {
  width: 100%;
  display: flex;
  gap: 0.8rem;
  padding-top: 1rem;
}

.role-tab {
  padding: 0.6rem 1.5rem;
  border: 1px solid rgba(var(--c-pink), 0.3);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: rgba(20, 10, 20, 0.5);
}

.role-tab.active, .role-tab:hover {
  background: rgba(var(--c-pink), 0.25);
  border-color: rgb(var(--c-pink));
  color: #fff;
  box-shadow: 0 0 15px rgba(var(--c-pink), 0.3);
}

/* 信息组件 */
.info-component {
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(var(--c-pink), 0.1);
}

.component-header {
  position: relative;
  padding: 0.8rem 1.5rem;
  overflow: hidden;
}

.component-header-bg {
  position: absolute;
  inset: 0;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: 100% 0;
  opacity: 0.6;
}

.component-header-content {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.component-title-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
}

.collapse-btn.active {
  transform: rotate(180deg);
}

.component-body {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
}

/* 表格 */
.info-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid rgba(var(--c-pink), 0.15);
}

.info-table td, .info-table th {
  padding: 8px;
  border: 1px solid rgba(var(--c-pink), 0.1);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
}

.label-cell {
  background: rgba(var(--c-deep-blue), 0.15);
  text-align: center;
  font-weight: 600;
  color: #b8a89a;
}

.value-cell {
  color: rgba(255, 255, 255, 0.8);
}

.value-cell a {
  color: rgb(var(--c-light-blue));
}

/* 统计标签 */
.stat-tabs, .skill-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stat-tab, .skill-tab {
  min-width: 80px;
  height: 40px;
  padding: 0 0.8rem;
  border: 1px solid rgba(var(--c-pink), 0.3);
  border-radius: 6px;
  background: rgba(20, 10, 20, 0.4);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-tab.active, .stat-tab:hover,
.skill-tab.active, .skill-tab:hover {
  background: rgba(var(--c-pink), 0.25);
  border-color: rgb(var(--c-pink));
  color: #fff;
  box-shadow: 0 0 12px rgba(var(--c-pink), 0.3);
}

.skill-tab {
  min-width: 100px;
}

/* 战斗风格表格 */
.battle-table .battle-icon-cell {
  text-align: center;
  padding: 8px;
  background: transparent;
  border-color: rgba(241, 239, 235, 0.1);
}

.battle-table .value-cell {
  line-height: 1.6;
  border-color: rgba(241, 239, 235, 0.1);
}

/* 共鸣回路表格 */
.circuit-table .circuit-icon-cell {
  text-align: center;
  padding: 8px;
  background: transparent;
  border-color: rgba(241, 239, 235, 0.1);
  vertical-align: top;
}

.circuit-table .value-cell {
  line-height: 1.8;
  border-color: rgba(241, 239, 235, 0.1);
  font-size: 0.9rem;
}

/* 共鸣链表格 */
.resonance-table .resonance-name-cell {
  text-align: center;
  padding: 8px;
  background: transparent;
  border-color: rgba(241, 239, 235, 0.1);
  vertical-align: top;
}

.resonance-table .value-cell {
  line-height: 1.8;
  border-color: rgba(241, 239, 235, 0.1);
  font-size: 0.9rem;
}

.resonance-table .text-gold {
  color: #c0a66a;
}

/* 突破材料表格 */
.material-table .material-cell {
  padding: 4px 8px;
  border-style: hidden;
  vertical-align: middle;
}

.material-table .material-cell img {
  vertical-align: middle;
  margin-right: 4px;
}

.material-table .material-cell a {
  color: rgb(var(--c-light-blue));
}

/* 技能图片 */
.skill-images {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.skill-divider {
  border: none;
  border-top: 1px solid rgba(var(--c-pink), 0.2);
  margin: 1.5rem 0;
}

.skill-energy {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  font-size: 0.95rem;
}

/* 技能内容 */
.skill-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.skill-name {
  color: #bb9f5e;
  font-size: 1.5rem;
  margin: 0;
}

.skill-details {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
}

.skill-details p {
  margin: 0.6rem 0;
}

.skill-branch {
  margin: 1rem 0;
}

.skill-data-details {
  margin-top: 1rem;
}

.skill-data-summary {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  padding: 0.5rem 0;
}

.skill-data-table {
  overflow-x: auto;
  margin-top: 0.5rem;
}

.data-table {
  min-width: 1100px;
}

.data-table th {
  background: #f0ece4;
  color: #333;
  font-weight: 600;
  text-align: center;
  padding: 8px;
  white-space: nowrap;
}

.data-table td {
  font-size: 0.85rem;
  text-align: center;
  white-space: nowrap;
}

.data-table td:first-child {
  text-align: left;
  background: rgba(var(--c-deep-blue), 0.08);
}

.data-table tbody tr:nth-child(odd) td:first-child {
  background: rgba(var(--c-deep-blue), 0.12);
}

.skill-placeholder {
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 3rem;
  font-style: italic;
}

/* 文本颜色 */
.text-gold {
  color: #f1c40f;
  font-weight: 600;
}

.text-red {
  color: #e03e2d;
  font-weight: 600;
}

.text-gold-underline {
  color: #f1c40f;
  font-weight: 600;
  text-decoration: underline;
}

/* 导航 */
.side-nav {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: flex-start;
  z-index: 100;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.side-nav.collapsed {
  transform: translate(calc(100% + 20px), -50%);
}

.toggle-btn {
  background: transparent;
  border: none;
  color: rgba(var(--c-pink), 0.8);
  padding: 15px 5px;
  cursor: pointer;
  position: absolute;
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  color: #fff;
  text-shadow: 0 0 10px rgba(var(--c-pink), 0.8);
  transform: translateY(-50%) scale(1.1);
}

.nav-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-height: 90vh;
  overflow-y: auto;
  background: transparent;
}

.nav-content::-webkit-scrollbar {
  display: none;
}

.nav-btn {
  flex-shrink: 0;
  background: rgba(20, 10, 20, 0.7);
  border: 1px solid rgba(var(--c-pink), 0.3);
  color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  writing-mode: vertical-lr;
  text-align: center;
  min-height: 60px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(var(--c-pink), 0.2);
  border-color: rgb(var(--c-pink));
  color: #fff;
  box-shadow: 0 0 15px rgba(var(--c-pink), 0.5);
  transform: translateX(-5px);
}

.top-btn {
  writing-mode: horizontal-tb;
  height: auto;
  min-height: auto;
  width: 100%;
  padding: 8px 0;
  font-size: 14px;
  letter-spacing: 0;
}

/* 响应式 */
@media screen and (max-width: 992px) {
  .content-section {
    padding: 4rem 1rem 2rem 1rem;
  }
  .role-content {
    flex-direction: column;
  }
  .role-images .figure img {
    max-height: 400px;
  }
  .hr-line {
    width: 100%;
  }
  .stat-tabs, .skill-tabs {
    justify-content: center;
  }
}
</style>

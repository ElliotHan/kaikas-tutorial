# kaikas-tutorial
> https://kaikas-tutorial.dev.klaytn.com/

```
- Engineer: 김보영(bong)
- PM: Euiyoul (Brian) Kim
- Support: Junsic "Chofa" Youn
```

## Objective
Kaikas deliverable이 PixelPlex로부터 도착했을 때 정상적으로 동작하는지 GX에서 검증 가능한 BApp 개발

## Scope
- Full-stack development of a BApp
- 단발성 내부툴이기 때문에 UX / graphic design 필요하지 않음
- 당장은 Kaikas가 없으므로 Metamask와 연동하여 동작하도록 개발, Kaikas가 도착하면 Kaikas와 연동하여 동작할 수 있도록 미리 설계
- Metamask를 사용하여 개발하던 개발자들이 같은 방식으로 추가적인 학습 없이 Kaikas로 개발 가능하다고 전제해야함
- Kaikas를 provider로 이용해서 BApp이 기능을 수행할 수 있는지까지만 검증하면 됨
- 성공/실패만 반환 - 추가적인 검증을 위해 자세한 데이터를 보고 싶다면 Klaytnscope 사용

## install
```
$ git clone https://github.com/ground-x/kaikas-tutorial.git
$ npm install
$ npm run local
```

## 상세기획 및 진행상황
https://groundx.atlassian.net/wiki/spaces/TEC/pages/edit/294519330?draftId=294453784&draftShareId=d67961b3-edec-486a-bee9-f1ae133da1e3&

## Deployment process

1. Create and work with branches by function
2. Code review from ground-x develop team
3. Merge to master branch after Code review (Squash merge)
4. After merge, it deploy to production
5. You can see deploy workflow in real time on [kaikas-tutorial cicleCI](https://circleci.com/gh/ground-x/kaikas-tutorial)

> Reference: [Static Site deploy process](https://groundx.atlassian.net/wiki/spaces/PG/pages/325615878/Static+Site+deploy+process)

(function () {
  const birthday = new Date('1998-9-1');
  const now = new Date();

  const instance = now.getTime() - birthday.getTime();

  const days = parseInt(instance / (60 * 1000 * 60 * 24));
  console.log(days);
})()

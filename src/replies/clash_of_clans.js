const getErrorMessage = (e) => {
	if (e.statusCode === 400 || e.statusCode === 403) {
		return 'Hatalı istek. Bu hatayı en kısa sürede bildirin.';
	}
	if (e.statusCode === 404) {
		return 'Klan bulunamadı.';
	}
	if (e.statusCode == 429) {
		return 'Çok fazla istek gönderildi, daha sonra tekrar deneyin.';
	}
	if (e.statusCode == 500 || e.statusCode == 503) {
		return 'Üzgünüz, Clash of Clans sunucusu yanıt vermiyor.' +
		' Lütfen daha sonra tekrar deneyin.';
	}
	// Production için error logging kaldırıldı
	return 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
};

const getTagHelpMessage = () => {
	let message = '';
		message += '\nOyuncu bilgilerini almak için "/oyuncu #oyuncuEtiketi" komutunu kullanın.\n';
		message += '\n  ,---------------------------------, ';
		message += '\n{ <b>Bir etikete dokunarak kopyalayın</b> }';
		message += '\n  \'---------------------------------\' ';
	return message;
};

module.exports = {
	getErrorMessage,
	getTagHelpMessage,
}
